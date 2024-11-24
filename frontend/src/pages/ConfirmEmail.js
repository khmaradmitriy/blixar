import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ConfirmEmail = () => {
  const { token } = useParams(); // Получаем токен из URL
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const response = await axios.get(`/api/auth/confirm/${token}`);
        const { accessToken, refreshToken } = response.data;

        // Сохраняем токены в localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        setMessage('Email успешно подтвержден! Перенаправляем...');
        setTimeout(() => navigate('/dashboard'), 3000); // Перенаправление через 3 секунды
      } catch (error) {
        setMessage(error.response?.data?.message || 'Ошибка подтверждения.');
      } finally {
        setLoading(false);
      }
    };

    confirmEmail();
  }, [token, navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      {loading ? (
        <h3>Подтверждение...</h3>
      ) : (
        <h3>{message}</h3>
      )}
    </div>
  );
};

export default ConfirmEmail;
