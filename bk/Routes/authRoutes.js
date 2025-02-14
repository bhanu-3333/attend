const express = require('express');
const { register , login , signOut } = require("../Controllers/AuthController");
// const {identifier } = require("../Midddleware/identifer");

const router = express.Router();

router.post('/register',register);
router.post('/login',login);
router.get('/signout',signOut);

module.exports = router
