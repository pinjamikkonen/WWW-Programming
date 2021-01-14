// Pinja Mikkonen
// WWW_programming 2019 spring
// 10ECTS coursework

var jwt = require('jsonwebtoken');
var User = require('../models/user_model.js');

exports.show_index = function (req, res){
  res.render('index.hbs');
}

exports.show_info = function(req, res){
  res.render('timetable_view');
}

exports.show_login = function (req, res){
  res.render('login_view');
}

exports.get_all_users = function(req, res){
  User.find(function (err, users){
    if (err){
      res.status = 500;
      console.error("Jokin meni pieleen! " + err);
    }
    if(!users){
      res.sendStatus(404);
      return console.error("Ei käyttäjiä! " + err);
    }
    else {
      res.set('Location', 'api/users/');
      res.status(200);
      res.render('userlist_view', {users: users});
    }
  })
}

exports.view_profile = function(req, res){
  User.findOne({'_id': req.params.id}, function (err, user) {
    if (err) {
      res.sendStatus(404);
      return console.error(err);};
    if (!user) {
      res.sendStatus(404)
    }
    else {
      res.set('Location', 'api/users/'+user._id);
      res.status(200);
      res.render('profile_view', {user: user});
    }
  });
}
