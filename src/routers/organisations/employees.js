const router = require('express').Router();
const auth = require('../../middleware/auth');
const User = require('../../models/user');
const Employee = require('../../models/employee');
const Organisation = require('../../models/organisation');
const { ObjectId } = require('mongodb');

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
    await employee.save();
    await user.save();

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
    const employees = [];
    const organisation = await Organisation.findOne({ _id: req.orgId })

    await organisation.populate({
      path: 'employees'
    }).execPopulate()

    if (!organisation.employees.length) {
      return res.status(404).send({
        error: 'Employees are not found in this organisation.'
      });
    }

    organisation.employees.forEach((employee) => employees.push(employee))
    
    res.status(200).send({ employees })
  } catch (e) {
    res.status(500).send()
  }
})

/**
 * Get next employee
 * 
 * @route
 * @verb GET
 * @name employees
 * @description 
 * @example
    GET: http://localhost:3000/employees/:id/next
    DATA: {}
*/
router.get('/:id/next', auth, async (req, res) => {
  try {
    const employee = await Employee.find({ _id: {$gt: ObjectId(req.params.id) }, organisation: req.orgId }).sort({ _id: 1 }).limit(1);;

    if (!employee) {
      return res.status(404).send();
    }

    res.status(200).send(employee);
  } catch (e) {
    console.log(e)
    res.status(500).send(e);
  }
})


/**
 * Get previous employee
 * 
 * @route
 * @verb GET
 * @name employees
 * @description 
 * @example
    GET: http://localhost:3000/employees/:id/prev
    DATA: {}
*/
router.get('/:id/prev', auth, async (req, res) => {
  try {
    const employee = await Employee.find({ _id: {$lt: ObjectId(req.params.id) }, organisation: req.orgId }).sort({ _id: -1 }).limit(1);;

    if (!employee) {
      return res.status(404).send();
    }

    res.status(200).send(employee);
  } catch (e) {
    res.status(500).send(e);
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
router.put('/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body.employee);
  const allowedUpdates = ['firstName', 'lastName', 'createdAt', 'updatedAt', 'birthday',  'image', 'photo', 'avatar', 'education', 'expertise', 'skills', 'languages', 'hobbies', 'song', 'thought', 'book', 'pet', 'skype', 'email'];
  const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
  
  if (!isValidUpdate) {
    return res.status(400).send({ error: 'Invalid updates.'})
  }

  try {
    const employee = await Employee.findOne({ _id: req.params.id, organisation: req.orgId })

    if (!employee) {
      return res.status(404).send();
    }


    updates.forEach(update => employee[update] = req.body.employee[update])

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

    res.status(200).send({});
  } catch (e) {
    res.status(500).send(e);
  }
})

module.exports = router;