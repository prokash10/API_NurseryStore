const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    FullName: {
        type:String,
        required:true
    },
    UserName: {
        type:String,
        required:true
    },
    Email: {
        type:String,
        required:true,
        unique:true
    },
    PhoneNo: {
        type:Number,
        required:true
    },
    Password: {
        type:String,
        required:true
    }
})

const User = mongoose.model('User', UserSchema)
module.exports = User