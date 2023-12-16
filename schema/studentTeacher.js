const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const StudentTeacher1 = Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['teacher', 'student'],
        required: true,
    },
    inSchool: {
        type: Schema.ObjectId,
        ref: 'school',
    },
    isActive: {
        type: Boolean,
        default: false,
    }
});

const StTecher = mongoose.model('StudentTeacher', StudentTeacher1)
module.exports = StTecher;

