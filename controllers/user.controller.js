const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../models/blacklistToken.model');
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

module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Return validation errors
    }
    const { email, password } = req.body;
    const user = await userModel.findOne({email}).select('+password');
    if(!user){
        return res.status(401).json({message:'Invalid email or password'});
    }
    const isMatch = await user.comparePassword(password);
    if(!isMatch){
        return res.status(401).json({message:'Invalid email or password'});
    }
    const token = user.generateAuthToken();
    res.status(200).json({token,user});
    res.cookie('token',token);
    
};

module.exports.getUserProfile = async(req, res, next) => {
    //here we are making a middleware ke agar koi user hai is naam se to entry le varna vo ek error bhejde unauthorized access karke,ye sab ek middle ware ke dwaara dekha jaata hai
    res.status(200).json(req.user);
}

module.exports.logoutUser = async(req, res, next) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    await blacklistTokenModel.create({ token });
    res.status(200).json({message:'Logged out successfully'});
}