// Pinja Mikkonen
// WWW_programming 2019 spring
// 10ECTS coursework

const express = require('express');
const api = express.Router();
const csrf = require('csurf');

const user_controller = require('../controllers/user_controller.js');

api.post('/login', user_controller.login);
api.post('/users', user_controller.add_user);

// Routes that require either user or admin rights
api.get('/users/:id', user_controller.verify_user, user_controller.view_profile);
api.put('/users/:id', user_controller.verify_user, user_controller.modify_profile);
api.delete('/users/:id', user_controller.verify_user, user_controller.delete_profile);

// Routes that require admin rights
api.get('/users', user_controller.verify_admin, user_controller.get_all_users);
api.delete('/users', user_controller.verify_admin, user_controller.delete_all_users);

module.exports = api;
