import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import ConfirmEmail from './pages/ConfirmEmail';
import AuthProvider from './context/AuthProvider';

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auth/confirm/:token" element={<ConfirmEmail />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;

