const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../src/models/user');
const Employee = require('../../src/models/employee');
const Organisation = require('../../src/models/organisation');

const orgOneId = new mongoose.Types.ObjectId();
const orgOne = {
  _id: orgOneId,
  name: "OrganisationOne"
}

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  password: "user56what!",
  email: "user@example.com",
  isAdmin: true,
  employee: ,
  organisation: ,
  tokens: [{
    token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
  }]
}

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  password: "user256what!",
  email: "user2@example.com",
  isAdmin: false,
  employee: ,
  organisation: ,
  tokens: [{
    token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
  }],
};

const setupDB = async () => {
  await User.deleteMany();
  await Task.deleteMany();

  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
}

module.exports = {
  userOne,
  userOneId,
  userTwo,
  userTwoId,
  setupDB,
  taskOne
}