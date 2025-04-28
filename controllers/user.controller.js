const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');

module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Return validation errors
    }
    console.log(req.body);
    const { fullname, email, password } = req.body;
    try {
        const hashedPassword = await userModel.hashPassword(password);
        const user = await userService.createUser({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashedPassword
        });
        const token = user.generateAuthToken();
        res.status(201).json({ token, user });
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error (email already exists)
            return res.status(400).json({ message: 'Email address is already registered' });
        }
        // Handle other potential errors
        console.error("Registration error:", error);
        res.status(500).json({ message: 'Internal server error' }); //generic error
    }
};