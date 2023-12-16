const express = require('express');
const Routes = express.Router();
const {
    teacherRegistration,
    teacherLogin,
    getActiveStudent,
    getActiveTeachers,
    unActiveUser
} = require('../controllers/teacher.controllers');


Routes.post('/register/:scId', teacherRegistration);
Routes.post('/login', teacherLogin);
Routes.get('/getTeacher/:schoolId', getActiveTeachers);
Routes.get('/getStudent/:schoolId', getActiveStudent);
Routes.get('/getUnactive/:schoolId', unActiveUser);
// Routes.get('/logInStdTch/:schoolId', unActiveUser);

module.exports = Routes; 