const router = require('express').Router();
const auth = require('../../middleware/auth');
const User = require('../../models/user');
const Employee = require('../../models/employee');
const Organisation = require('../../models/organisation');

const createUser = (employee) => {
  return new User({
    email: employee.email,
    password: employee.password,
    isAdmin: employee.isAdmin,
    employee,
    organisation: employee.organisation._id
  });
}

/**
 * Create a new employee
 * 
 * @route
 * @verb POST
 * @name employees
 * @description 
 * @example
    POST: http://localhost:3000/employees
    DATA: {
      "firstName": "Martin",
      "lastName": "Radev",
      "email": "martin.radev@intranet.com",
      "isAdmin": true
    }
*/
router.post('/', auth, async (req, res) => {
  const employee = new Employee({
    ...req.body,
    organisation: req.orgId
  })
  const user = createUser(employee);

  try {
    await user.save();
    await employee.save();

    res.status(201).send({ employee });
  } catch (e) {
    res.status(400).send(e);
  }
});

/**
 * Get all employees
 * 
 * @route
 * @verb GET
 * @name employees
 * @description 
 * @example
    GET: http://localhost:3000/employees
    DATA: {}
*/
router.get('/', auth, async (req, res) => {
  try {
    const organisation = await Organisation.findOne({ _id: req.orgId })

    await organisation.populate({
      path: 'employees'
    }).execPopulate()

    if (!organisation.employees.length) {
      return res.status(404).send({
        error: 'Employees are not found in this organisation.'
      });
    }

    res.status(200).send(organisation.employees)
  } catch (e) {
    res.status(500).send()
  }
})

/**
 * Update an employee
 * 
 * @route
 * @verb PUT
 * @name employees
 * @description 
 * @example
    PUT: http://localhost:3000/employees/:id
    DATA: {
      "firstName": "Martin",
      "lastName": "Radev"
    }
*/
router.patch('/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['firstName', 'lastName'];
  const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
  
  if (!isValidUpdate) {
    return res.status(400).send({ error: 'Invalid updates.'})
  }
  
  try {
    const employee = await Employee.findOne({ _id: req.params.id, organisation: req.orgId })

    if (!employee) {
      return res.status(404).send();
    }

    updates.forEach(update => employee[update] = req.body[update])
    await employee.save();

    res.status(200).send(employee);
  } catch (e) {
    res.status(400).send(e);
  }
})

/**
 * Delete an employee
 * 
 * @route
 * @verb DELETE
 * @name employees
 * @description 
 * @example
    PUT: http://localhost:3000/employees/:id
    DATA: {}
*/
router.delete('/:id', auth, async (req, res) => {
  try {
    await Employee.deleteOne({ _id: req.params.id, organisation: req.orgId })
    await User.deleteOne({ employee: req.params.id, organisation: req.orgId })

    res.status(200).send();
  } catch (e) {
    res.status(500).send(e);
  }
})

module.exports = router;