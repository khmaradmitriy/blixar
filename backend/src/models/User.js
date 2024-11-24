const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Схема пользователя
const userSchema = new mongoose.Schema(
  {
    lastName: { type: String, required: true }, // Фамилия (обязательно)
    firstName: { type: String, required: true }, // Имя (обязательно)
    middleName: { type: String, default: '' }, // Отчество (опционально)
    email: { type: String, required: true, unique: true }, // Уникальный email
    password: { type: String, required: true }, // Хэшированный пароль
    emailConfirmed: { type: Boolean, default: false }, // Подтвержден ли email
    emailToken: { type: String, default: '' }, // Токен подтверждения email
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }], // Связь с ролями
  },
  { timestamps: true } // Автоматическое добавление createdAt и updatedAt
);

// Перед сохранением пользователя хэшировать пароль
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    console.error('Ошибка хэширования пароля:', error);
    next(error);
  }
});

module.exports = mongoose.model('User', userSchema);
