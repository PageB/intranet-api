const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const Organisation = require('../src/models/organisation');
const { orgTwo, orgTwoId, setupDB } = require('./fixtures/db')

beforeEach(setupDB);

test('Should create admin user organisation.', async () => {
  await request(app)
    .post('/organisations')
    .send(orgTwo)
    .expect(201);

  const user = await User.findOne({ organisation: orgTwoId });

  expect(user).not.toBeNull();
});

test('Should create organisation.', async () => {
  await request(app)
    .post('/organisations')
    .send(orgTwo)
    .expect(201);

  const organisation = await Organisation.findById(orgTwoId);

  expect(organisation).not.toBeNull();
});

test('Should not create organisation with invalid name', async () => {
  await request(app)
    .post('/organisations')
    .send({
      name: ''
    })
    .expect(400);
});