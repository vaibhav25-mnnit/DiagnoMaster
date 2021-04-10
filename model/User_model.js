const mongoose = require('mongoose')
const schema = mongoose.Schema;


const userschema = new schema({

    name: {
        type: String,
        required: true,
    },
    username: {
        type: String
    },
    password: {
        type: String,
    },
    gender: {
        type: String,
    },
    BMI_INFO: {
        Date_measured: { type: String },
        BMI: { type: Number },
        Status: { type: String }
    }


})


const User = mongoose.model('User', userschema);

module.exports = User;