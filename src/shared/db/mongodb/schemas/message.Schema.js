const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: { 
        type: Number,
        required: true
    },
    company_name: {
        type: String,
        required: true
    },
    project_name: {
        type: String,
        required: true
    },
    project_desc: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    message: {
        type: String,
        max: 100,
    },
    file: {
        type: String,
        required: true
    }
}, { timestamps: true })


module.exports = mongoose.model('Message', MessageSchema)
