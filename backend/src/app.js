// app.js - Настройки приложения

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes'); // Основные маршруты
require('dotenv').config(); // Загрузка переменных окружения

const app = express();



// Middlewares
app.use(cors()); // Поддержка CORS
app.use(bodyParser.json()); // Парсинг JSON
app.use('/api', routes); // Префикс для всех маршрутов

module.exports = app;

