const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');
const router = express.Router();

const JWT_SECRET = "webTokenSecret-Vedant"

// endpoint- /api/auth/createuser
router.post('/createuser', [
    body('name', 'name must be of minimum 3 characters').isLength({ min: 3 }),
    body('email', 'Invalid Email').isEmail(),
    body('password', 'Password must be of minimum 5 characters').isLength({ min: 5 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).send("Sorry! User with this email already exists");
        }
        const salt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPassword
        })
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({ authtoken });
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal Server Error");
    }
})

// endpoint- /api/auth/login
router.post('/login', [
    body('email', 'Invalid Email!').isEmail(),
    body('password', "Password cannot be empty").exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send("Invalid credentials!");
        }
        const comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) {
            return res.status(400).send("Invalid Credentials!");
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        return res.json({ authtoken });
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})

//Get loggedIn user details 
//endpoint- /api/auth/getUser
router.post('/getUser', fetchUser, async (req, res) => {
    try {
        const id = req.user.id;
        const user = await User.findById(id).select("-password");
        return res.json({ user });
    } catch (error) {
        if (error) {
            return res.status(500).send('Internal Server Error');
        }
    }
})


module.exports = router