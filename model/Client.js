const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    name:{
        type: 'string',
        required: true
    },
    email: {
        type: 'string',
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true
    }
})

const clientSchema = mongoose.model('clientSchema', Schema)
module.exports =  clientSchema