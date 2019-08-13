const router = require('express').Router();
const employees = require('./organisations/employees');
const User = require('../models/user');
const Organisation = require('../models/organisation');

const createAdminUser = (organisation) => {
  const organisationDomain = organisation.name.trim().toLowerCase();

  return new User({
    email: `admin@${organisationDomain}.com`,
    password: 'admin1234!',
    isAdmin: true,
    organisation
  });
}

/**
 * Create a new organisation
 * 
 * @route
 * @verb POST
 * @name organisations
 * @description 
 * @example
    POST: http://localhost:3000/organisations
    DATA: {
      "name": "Fourth"
    }
*/
router.post('/', async (req, res) => {
  const organisation = new Organisation(req.body);
  const user = createAdminUser(organisation);

  try {
    await organisation.save();
    await user.save();

    res.status(201).send({ organisation });
  } catch (e) {
    res.status(400).send(e);
  }
});

/**
 * Extend organisation route with REST operations for employees
 * 
 * @example
    POST/PUT/DELETE: http://localhost:3000/organisations/:orgId/employees
*/
router.use('/:orgId/employees', function(req, res, next) {
  req.orgId = req.params.orgId;
  next()
}, employees);

module.exports = router;