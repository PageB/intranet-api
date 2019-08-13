const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../src/models/user');
const Employee = require('../../src/models/employee');
const Organisation = require('../../src/models/organisation');

const employeeOneId = new mongoose.Types.ObjectId();
let employeeOne = {
  _id: employeeOneId,
  firstName: "EmployeeOneFirst",
  lastName: "EmployeeOneLast"
}

const employeeTwoId = new mongoose.Types.ObjectId();
let employeeTwo = {
  _id: employeeTwoId,
  firstName: "EmployeeTwoFirst",
  lastName: "EmployeeTwoLast"
}

const orgOneId = new mongoose.Types.ObjectId();
const orgOne = {
  _id: orgOneId,
  name: "OrganisationOne"
}

const orgTwoId = new mongoose.Types.ObjectId();
const orgTwo = {
  _id: orgTwoId,
  name: "OrganisationTwo"
}

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  password: "user56what!",
  email: "user@example.com",
  isAdmin: true,
  employee: employeeOne._id,
  organisation: orgOne._id,
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
  employee: employeeTwo._id,
  organisation: orgOne._id,
  tokens: [{
    token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
  }],
};

employeeOne = Object.assign(employeeOne, {
  password: userOne.password,
  email: userOne.email,
  isAdmin: userOne.isAdmin
})

employeeTwo = Object.assign(employeeTwo, {
  password: userTwo.password,
  email: userTwo.email,
  isAdmin: userTwo.isAdmin
})

const setupDB = async () => {
  await User.deleteMany();
  await Employee.deleteMany();
  await Organisation.deleteMany();

  await new User(userOne).save();
  await new User(userTwo).save();
  await new Employee(employeeOne).save();
  await new Employee(employeeTwo).save();
  await new Organisation(orgOne).save();
}

module.exports = {
  userOne,
  userOneId,
  userTwo,
  userTwoId,
  employeeOne,
  employeeOneId,
  employeeTwo,
  employeeTwoId,
  orgOne,
  orgOneId,
  orgTwo,
  orgTwoId,
  setupDB
}