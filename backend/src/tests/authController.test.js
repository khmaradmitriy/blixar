const { register } = require('../controllers/authController');
const User = require('../models/User');

jest.mock('../models/User'); // Мокаем модель для изоляции логики

describe('Auth Controller - Register', () => {
  it('Успешная регистрация', async () => {
    const mockReq = {
      body: { username: 'testuser', email: 'test@example.com', password: 'password123' },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    User.create.mockResolvedValue({ username: 'testuser', email: 'test@example.com' });

    await register(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Пользователь успешно зарегистрирован',
      user: { username: 'testuser', email: 'test@example.com' },
    });
  });

  it('Ошибка регистрации', async () => {
    const mockReq = {
      body: { username: 'testuser', email: 'test@example.com', password: 'password123' },
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    User.create.mockRejectedValue(new Error('Ошибка'));

    await register(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Ошибка регистрации',
      error: expect.any(Object),
    });
  });
});
