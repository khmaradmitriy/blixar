const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const logger = require('../utils/logger'); // Утилита для логирования
const { validationResult } = require('express-validator');
require('dotenv').config(); // Загрузка переменных окружения


// Настройки почтового сервера
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Отключить проверку сертификатов (для тестирования)
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Ошибка подключения к SMTP:', error);
  } else {
    console.log('SMTP-сервер готов принимать сообщения.');
  }
});

// Регистрация нового пользователя
exports.register = async (req, res) => {
  const { lastName, firstName, middleName, email, password, roles } = req.body;

  // Проверка входных данных
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Ошибки валидации при регистрации:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Проверить, существует ли пользователь с таким же email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(`Регистрация не удалась: пользователь с email ${email} уже существует.`);
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    // Найти указанные роли (если они есть)
    const roleDocs = roles && roles.length ? await Role.find({ name: { $in: roles } }) : [];
    const roleIds = roleDocs.map((role) => role._id);

    // Создать токен для подтверждения email
    const emailToken = jwt.sign({ email }, process.env.EMAIL_SECRET, { expiresIn: '1d' });

    // Создать нового пользователя
    const user = await User.create({
      lastName,
      firstName,
      middleName,
      email,
      password,
      roles: roleIds, 
      emailToken,
    });

    // Отправить письмо с подтверждением
    const confirmUrl = `${process.env.APP_URL || 'http://localhost:5000'}/auth/confirm/${emailToken}`;
    console.log('APP_URL:', process.env.APP_URL);
    console.log('Ссылка подтверждения:', confirmUrl);
      const info = await transporter.sendMail({
        from: process.env.SMTP_USER, // Ваш email (должен совпадать с SMTP_USER)
        to: email, // Получатель
        subject: 'Подтверждение E-mail', // Тема письма
        text: `Перейдите по ссылке для подтверждения: ${confirmUrl}`, // Текст письма
      });


    logger.info(`Новый пользователь зарегистрирован: ${email}. Письмо отправлено.`);
    res.status(201).json({ message: 'Пользователь успешно зарегистрирован. Проверьте email для подтверждения.' });
  } catch (error) {
    logger.error('Ошибка регистрации пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Подтверждение email
exports.confirmEmail = async (req, res) => {
  const { token } = req.params;

  try {
    // Расшифровать токен
    const decoded = jwt.verify(token, process.env.EMAIL_SECRET);

    // Найти пользователя по email
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }

    // Проверить, подтвержден ли уже email
    if (user.emailConfirmed) {
      return res.status(400).json({ message: 'Email уже подтвержден.' });
    }

    // Обновить статус подтверждения email
    user.emailConfirmed = true;
    user.emailToken = '';
    await user.save();

    // Генерация JWT токена для автоматической авторизации
    const accessToken = jwt.sign(
      { id: user._id, roles: user.roles },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Email успешно подтвержден!',
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Ошибка подтверждения email:', error.message);
    res.status(400).json({ message: 'Неверный или истекший токен.' });
  }
};

// Авторизация пользователя
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Найти пользователя по email
    const user = await User.findOne({ email }).populate('roles');
    if (!user) {
      logger.warn(`Неудачная попытка входа: пользователь с email ${email} не найден.`);
      return res.status(401).json({ message: 'Неверные учетные данные' });
    }

    // Проверить подтверждение email
    if (!user.emailConfirmed) {
      logger.warn(`Попытка входа с неподтвержденным email: ${email}`);
      return res.status(403).json({ message: 'Email не подтвержден. Проверьте почту.' });
    }

    // Проверить пароль
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Неверный пароль для пользователя ${email}`);
      return res.status(401).json({ message: 'Неверные учетные данные' });
    }

    // Генерация токенов
    const accessToken = jwt.sign(
      { id: user._id, roles: user.roles.map((role) => role.name) },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    logger.info(`Пользователь ${email} успешно авторизован.`);
    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    logger.error('Ошибка авторизации пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
