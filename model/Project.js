const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    name:{
        type: 'string',
        required: true
    },
    description: {
        type: 'string',
        required: true
    },
    status: {
        type: "string",
        enum: ["Not started", "In progress", "Completed"]
    },
    clientId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'clientSchema'
    }
})

const projectSchema = mongoose.model('projectSchema', Schema)
module.exports =  projectSchema