// db.js - Подключение к базе данных MongoDB с повторными попытками в случае неудачи
const mongoose = require('mongoose');

// Функция для подключения к базе данных
const connectDB = async () => {
  const maxRetries = 5; // Максимальное количество попыток подключения
  let retries = 0;

  while (retries < maxRetries) {
    try {
      // Попытка подключения к MongoDB
      await mongoose.connect(process.env.MONGO_URI);
      console.log('✅ Успешное подключение к MongoDB');
      break; // Выход из цикла при успешном подключении
    } catch (error) {
      retries += 1;
      console.error(`❌ Ошибка подключения к MongoDB: попытка ${retries}`, error);

      if (retries === maxRetries) {
        process.exit(1); // Завершение приложения при достижении максимального числа попыток
      }

      // Ожидание перед повторной попыткой подключения
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
};

module.exports = connectDB;

