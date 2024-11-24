const express = require('express');
const { body } = require('express-validator');
const { register, login, confirmEmail } = require('../controllers/authController');

const router = express.Router();

// Регистрация пользователя
router.post(
  '/register',
  [
    body('lastName').notEmpty().withMessage('Фамилия обязательна'),
    body('firstName').notEmpty().withMessage('Имя обязательно'),
    body('email').isEmail().withMessage('Некорректный email'),
    body('password').isLength({ min: 6 }).withMessage('Пароль должен быть не менее 6 символов'),
  ],
  register
);

// Подтверждение email
router.get('/confirm/:token', confirmEmail);

// Авторизация пользователя
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Некорректный email'),
    body('password').notEmpty().withMessage('Пароль обязателен'),
  ],
  login
);

module.exports = router;
