const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const { userOne, userOneId, setupDB } = require('./fixtures/db')

beforeEach(setupDB);

test('Should login a user', async () => {
  const response = await request(app)
    .post('/users/login')
    .send(userOne)
    .expect(200);

  const user = await User.findById(userOneId);

  expect(user).not.toBeNull();
  expect(response.body.token).toBe(user.tokens[1].token);
});

test('Should login and logout user', async () => {
  const loginResponse = await request(app)
    .post('/users/login')
    .send(userOne)
    .expect(200);

  const user = await User.findById(userOneId);

  expect(user).not.toBeNull();
  expect(loginResponse.body.token).toBe(user.tokens[1].token);

  const logoutResponse = await request(app)

  .post('/users/logout')
  .set('Authorization', `Bearer ${user.tokens[1].token}`)
  .send()
  .expect(200);

  expect(logoutResponse.body.token).toBeUndefined();
});

test('Should not login nonexistent user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: "ivan@example.com",
      password: "MyPass777!"
    })
    .expect(400);
});

test('Should not login user with wrong password', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: "MyPass777!"
    })
    .expect(400);
});
