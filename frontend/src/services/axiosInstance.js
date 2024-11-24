import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // Убедитесь, что сервер работает на этом URL
});

export default instance;
