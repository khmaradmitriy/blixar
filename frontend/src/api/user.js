import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const fetchAllUsers = async (token) => {
  const response = await axios.get(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
