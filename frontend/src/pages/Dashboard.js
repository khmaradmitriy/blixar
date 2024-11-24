import React, { useEffect, useState, useContext } from 'react';
import { fetchAllUsers } from '../api/user';
import Loader from '../components/Loader';
import UserList from '../components/UserList';
import { AuthContext } from '../context/AuthProvider';

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.roles.includes('admin')) {
      fetchAllUsers(token)
        .then(setUsers)
        .catch(() => setError('Ошибка загрузки пользователей'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user, token]);

  if (loading) return <Loader />;
  if (error) return <p className="text-danger text-center">{error}</p>;

  return (
    <div>
      <h1 className="text-center mt-4">Добро пожаловать, {user.fullName}</h1>
      {user?.roles.includes('admin') ? (
        <UserList users={users} />
      ) : (
        <p className="text-center">У вас нет прав доступа к списку пользователей.</p>
      )}
    </div>
  );
};

export default Dashboard;
