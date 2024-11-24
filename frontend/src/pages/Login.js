import React, { useState, useContext } from 'react';
import AuthForm from '../components/AuthForm';
import { login } from '../api/auth';
import { AuthContext } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login: authLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { accessToken, user } = await login(email, password);
      authLogin(user, accessToken);
      navigate('/dashboard');
    } catch {
      setError('Неверные учетные данные');
    }
  };

  return (
    <div>
      {error && <p className="text-danger text-center">{error}</p>}
      <AuthForm
        title="Войти"
        fields={[
          { name: 'email', type: 'email', placeholder: 'Email', value: email, onChange: (e) => setEmail(e.target.value) },
          { name: 'password', type: 'password', placeholder: 'Пароль', value: password, onChange: (e) => setPassword(e.target.value) },
        ]}
        buttonText="Войти"
        onSubmit={handleSubmit}
        link={{ href: '/register', text: 'Нет аккаунта? Зарегистрироваться' }}
      />
    </div>
  );
};

export default Login;




