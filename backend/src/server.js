// server.js - Точка входа в приложение

const app = require('./app');
const connectDB = require('./config/db');

const express = require('express');
const path = require('path'); // Добавьте этот импорт

// Подключение к базе данных MongoDB
connectDB();

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Сервер запущен на порту ${PORT}`));
