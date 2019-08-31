const mongoose = require('mongoose');

const organisationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

organisationSchema.virtual('users', {
  ref: 'User',
  foreignField: 'organisation',
  localField: '_id'
});

organisationSchema.virtual('employees', {
  ref: 'Employee',
  foreignField: 'organisation',
  localField: '_id'
});

organisationSchema.virtual('teams', {
  ref: 'Team',
  foreignField: 'organisation',
  localField: '_id'
});

organisationSchema.virtual('positions', {
  ref: 'Position',
  foreignField: 'organisation',
  localField: '_id'
});

const Organisation = mongoose.model('Organisation', organisationSchema);

module.exports = Organisation;