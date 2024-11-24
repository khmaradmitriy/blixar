const mongoose = require('mongoose');

// Схема ролей
const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // Название роли, например: 'admin', 'user'
  },
  { timestamps: true } // Автоматическое добавление createdAt и updatedAt
);

module.exports = mongoose.model('Role', roleSchema);
