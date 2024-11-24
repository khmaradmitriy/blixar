const { createLogger, format, transports } = require('winston');

// Создание логгера
const logger = createLogger({
  level: 'info', // Уровень логирования: info, warn, error
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
  ),
  transports: [
    new transports.Console(), // Логирование в консоль
    new transports.File({ filename: 'logs/app.log' }), // Логирование в файл
  ],
});

module.exports = logger;
