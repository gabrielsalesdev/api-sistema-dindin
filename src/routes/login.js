const express = require('express');
const loginControllers = require('../controllers/login');

const routes = express.Router();

routes.post('/login', loginControllers.login);

module.exports = routes;