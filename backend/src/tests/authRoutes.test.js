const request = require('supertest');
const app = require('../app'); // Импорт приложения

describe('Auth Routes', () => {
  it('POST /api/auth/register - успешная регистрация', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Пользователь успешно зарегистрирован');
  }, 20000);

  it('POST /api/auth/register - ошибка регистрации (дублирующий email)', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
      console.log('Ответ:', res.body);
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser2',
        email: 'test@example.com',
        password: 'password123',
      });
      console.log('Ответ:', res.body);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Ошибка регистрации');
  });
});
