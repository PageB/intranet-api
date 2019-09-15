const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const User = require('./user');

const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Passowrd cannot contain password.');
      }
    }
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid.');
      }
    }
  },
  birthday: {
    type: Date,
    required: true
  },
  image: {},
  photo: {},
  avatar: {},
  education: {
    type: String,
    required: true
  },
  expertise: {
    type: String,
    required: true
  },
  skills: {
    type: String,
    required: true
  },
  languages: {
    type: String,
    required: true
  },
  hobbies: {
    type: String,
    required: true
  },
  song: {
    type: String,
    required: true
  },
  thought: {
    type: String,
    required: true
  },
  book: {
    type: String,
    required: true
  },
  pet: {
    type: String,
    required: true
  },
  skype: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'User'
  },
  organisation: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'Organisation'
  },
}, {
  timestamps: true
});

employeeSchema.methods.toJSON = function () {
  const userObject = this.toObject();

  delete userObject.password;
  delete userObject.isAdmin;

  return userObject;
}

employeeSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcryptjs.hash(this.password, 8);
  }

  next();
});

employeeSchema.pre('remove', async function (next) {
  await User.deleteOne({ employee: this._id })

  next()
})


const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;