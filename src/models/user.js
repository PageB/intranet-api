const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employee = require('./employee');

const userSchema = new mongoose.Schema({
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
  isAdmin: {
    type: Boolean,
    default: false
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'Employee'
  },
  organisation: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'Organisation'
  },
  tokens: [{
    token: {
      type: String,
      require: true
    }
  }]
}, {
  timestamps: true
});

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  
  delete user.password;
  delete user.tokens;

  return user;
}

userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET)

  this.tokens = this.tokens.concat({ token })
  await this.save()

  return token
}

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Unable to login. Please try again')
  }

  const isMatch = await bcryptjs.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Unable to login. Please try again.')
  }

  return user;
}

// Hash the plain text before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcryptjs.hash(this.password, 8);
  }

  next();
});

// Delete user employee when user is removed
userSchema.pre('remove', async function (next) {
  await Employee.deleteMany({ owner: this._id })

  next()
})
// after save
// userSchema.post()

const User = mongoose.model('User', userSchema);

module.exports = User;