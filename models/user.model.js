const mongoose = require('mongoose');
const bcrypt =require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    fullname:{
        firstname:{
            type:String,
            required:true,
            //minlength:[3,'first name must be atleast 3 characters long'],

        },
        lastname:{
            type:String,
            //required:true, last name can be optional
           // minlength:[3,'last name must be atleast 3 characters long'],
            
        }
    },
    email:{
        type:String,
        required:true,
        unique: true,
        //minlength:[5,'email must be atleast 3 characters long'],

    },
    password:{
        type:String,
        required:true,
        select:false, // password wont be shared when we find the user
        //unique: true,
        //minlength:[5,'email must be atleast 3 characters long'], not required because we are using jwt for authentication
    },
    socketId:{// use to share live location 
        type : String
    },
});

// for hash password and jwt token we need to install 2 packages here
//npm i bycrpt for hashing and comparing password
//jsonwebtoken for basic authentication
userSchema.methods.generateAuthToken= function(){
    const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET);
    return token;
}
userSchema.methods.comparePassword = async function (password){
    return await bcrypt.compare(password,this.password);
}
userSchema.statics.hashPassword=async function(password){
    return await bcrypt.hash(password,20);
}
const userModel = mongoose.model('user',userSchema);
module.exports=userModel;

//we will create routes but their logic will be stored in backend