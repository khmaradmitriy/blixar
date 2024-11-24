import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { register } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Проверка пароля
    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают.');
      return;
    }

    try {
      const userData = {
        lastName,
        firstName,
        middleName,
        email,
        password,
      };
      await register(userData);
      setSuccess('Регистрация прошла успешно! Перенаправление...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка регистрации');
    }
  };

  return (
    <div>
      {error && <p className="text-danger text-center">{error}</p>}
      {success && <p className="text-success text-center">{success}</p>}
      <Form
        onSubmit={handleSubmit}
        className="p-4 border rounded shadow-sm"
        style={{ maxWidth: '400px', margin: 'auto', marginTop: '50px' }}
      >
        <h2 className="text-center">Регистрация</h2>
        <Form.Group className="mb-3">
          <Form.Label>Фамилия</Form.Label>
          <Form.Control
            type="text"
            placeholder="Введите вашу фамилию"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            autoComplete="off"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Имя</Form.Label>
          <Form.Control
            type="text"
            placeholder="Введите ваше имя"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            autoComplete="off"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Отчество</Form.Label>
          <Form.Control
            type="text"
            placeholder="Введите ваше отчество (если есть)"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
            autoComplete="off"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Введите email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Пароль</Form.Label>
          <Form.Control
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Подтверждение пароля</Form.Label>
          <Form.Control
            type="password"
            placeholder="Введите пароль еще раз"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            isInvalid={password !== confirmPassword && confirmPassword.length > 0}
          />
          <Form.Control.Feedback type="invalid">
            Пароли не совпадают.
          </Form.Control.Feedback>
        </Form.Group>
        <Button type="submit" variant="primary" className="w-100">
          Зарегистрироваться
        </Button>
        <div className="mt-3 text-center">
          <a href="/login">Уже есть аккаунт? Войдите</a>
        </div>
      </Form>
    </div>
  );
};

export default Register;
