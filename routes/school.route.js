const express = require('express');
const Routes = express.Router();
const { register , loginSchool} = require('../controllers/school.contollers');
const { getUnActive } = require('../controllers/getUnActive');

Routes.post('/register', register );
Routes.post('/login', loginSchool);
Routes.get('/unactive/:schoolId', getUnActive);

module.exports = Routes