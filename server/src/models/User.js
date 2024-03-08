const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
    },
    userName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        unique: true,
        required: true,
    },
    confirmPassword: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        default: null,
    },
    bio:{
        type: String,
        default: null,
    },
    social: {
        facebook: {
            type: String,
            default: null,
        },
        twitter: {
            type: String,
            default: null,
        },
        linkedin: {
            type: String,
            default: null,
        },
        instagram: {
            type: String,
            default: null,
        },
    },
    profilePic: {
        type: String,
        default: null,
    },
    
    resetPasswordOtp: {
        type: String,
        default: null,
    },
    resetPasswordExpiresAt: {
        type: Date,
        default: null,
    }
})

module.exports = mongoose.model('User', userSchema);
