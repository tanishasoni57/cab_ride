//creating time to live token so if any user logout we will blacklist that token
const mongoose= require('mongoose');
const blacklistTokenSchema = new mongoose.Schema({
    token:{
        type:String,
        required:true,
        unique:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:86400
    }
});

module.exports = mongoose.model('blacklistToken',blacklistTokenSchema);