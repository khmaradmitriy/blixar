// index.js - Главный роутер приложения
const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');

// Подключение модулей маршрутов
router.use('/auth', authRoutes);

module.exports = router;

