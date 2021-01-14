// Pinja Mikkonen
// WWW_programming 2019 spring
// 10ECTS coursework

const express = require('express');
const view_router = express.Router();

var view_controller = require('../controllers/view_controller.js');

// Routes for hbs views
view_router.get('/', view_controller.show_index);
view_router.get('/info', view_controller.show_info);
view_router.get('/login', view_controller.show_login);
view_router.get('/users', view_controller.get_all_users);
view_router.get('/users/:id', view_controller.view_profile);

module.exports = view_router;
