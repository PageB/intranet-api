const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');

/**
 * Login user
 * 
 * @route
 * @verb POST
 * @name users/login
 * @description 
 * @example
    POST: http://localhost:3000/users/login
    DATA: {
      "email": "martin.radev@intranet.com",
      "password": "pass1234!"
    }
  */
 router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();

    res.status(200).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

/**
 * Logout user
 * 
 * @route
 * @verb POST
 * @name users/logout
 * @description 
 * @example
    POST: http://localhost:3000/users/logout
    DATA: {

    }
  */
router.post('/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();

    res.status(200).send();
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;