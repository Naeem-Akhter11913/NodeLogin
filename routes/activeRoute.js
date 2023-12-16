const express = require('express');
const { activeAcount } = require('../controllers/active/active');
const Routes = express.Router();

Routes.put('/active/:token', activeAcount)
module.exports = Routes