const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SchoolSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['school'],
        required: true,
    },
    isActive: {
        type: Boolean,
        default: false,
    }
});

const schema = mongoose.model('School', SchoolSchema);

module.exports = schema