const userModel = require('../models/user.model');


module.exports.createUser = async({
    firstname,lastname,email,password//this func will accept all these in terms of object

}) =>{
    if(!firstname || !email || !password){
        throw new Error('All fields are required');
    }
    const user = userModel.create({
        fullname:{
            firstname,
            lastname
        },
        email,
        password
    })
    return user;
}