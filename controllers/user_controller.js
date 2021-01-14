// Pinja Mikkonen
// WWW_programming 2019 spring
// 10ECTS coursework

var bcrypt = require('bcryptjs');
var User = require('../models/user_model.js');
var jwt = require('jsonwebtoken');
var xss = require('xss-filters');

const {
  check,
  validationResult,
  oneOf
} = require('express-validator/check');

const saltRounds = 12;
const secret = 'titithepiss';
const path = 'localhost:3000';

// verify user token
exports.verify_user = function(req, res, next){
  if (req.headers.authorization) {
    if (req.headers.authorization.startsWith('Bearer ')) {
       var token = req.headers.authorization.slice(7, req.headers.authorization.length);
        jwt.verify(token, secret, function(err, decoded) {
          if(err) res.sendStatus(401);
          else {
            if (decoded.admin){
              next();
            }
            else if (decoded.id == req.params.id){
              next();
            }
            else{
              res.sendStatus(401);
            }
          }
      });
    }
    else {
      res.sendStatus(401);
    }
  }
  else {
    res.sendStatus(401);
  }
}

// Verify admin token
exports.verify_admin = function(req, res, next){
  if (req.headers.authorization) {
    if (req.headers.authorization.startsWith('Bearer ')) {
       var token = req.headers.authorization.slice(7, req.headers.authorization.length);
        jwt.verify(token, secret, function(err, decoded) {
          if(err) res.sendStatus(401);
          else {
            if (decoded.admin){
              next();
            }
            else{
              res.sendStatus(401);
            }
          }
      });
    }
    else {
      res.sendStatus(401);
    }
  }
  else {
    res.sendStatus(401);
  }
}

// Return user list
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
      res.status(200);
      res.json(users);
    }
  })
}

// Return user's profile
exports.view_profile = function(req, res){
  User.findOne({'_id': req.params.id}, function (err, user) {
    if (err) {
      res.sendStatus(404);
      return console.error(err);};
    if (!user) {
      res.sendStatus(404)
    }
    else {
      res.set('Location', path+'api/users/'+user._id);
      res.status(200);
      res.json(user);
    }
  });
}

// Log user in
exports.login = function(req, res){
  if (req.body && req.body.username && req.body.password){
    var username = req.sanitize(req.body.username);
    var password = req.sanitize(req.body.password);

    User.findOne({'username': username}, function(err, user){
      if (err){
        res.sendStatus(404);
        return console.error(err);
      };
      if (user){
        bcrypt.compare(password, user.password, function(err, result){
          if (result){
            jwt.sign({admin: user.admin, id: user._id}, secret, {algorithm: 'HS256'}, function(err, token){
              res.status(201);
              res.json({"token": token, "admin": user.admin, "id": user._id});
            });
          }
          else {
            res.sendStatus(401);
            return console.error("Väärä salasana!");
          }
        });
      }
      else {
        res.sendStatus(401);
        return console.error("Väärä käyttäjätunnus!");
      }
    });
  }
  else {
    res.sendStatus(400);
    return console.error("Bad request");
  }
}

// Add new user
exports.add_user = [check('email').isEmail().withMessage("Sähköpostiosoite vaadittu"),
check('username').isLength({min: 4}).withMessage("Käyttäjätunnuksen minimipituus on 5 merkkiä"),
check('password').isLength({min: 4}).withMessage("Salasanan minimipituus on 5 merkkiä"),
check('credit').isCreditCard().withMessage("Olemme köyhiä, syötäthän oikean luottokortin tjsp"),
function(req, res){
  if (req.body && req.body.username && req.body.email && req.body.password){
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.sendStatus(422)
      return console.error(errors.mapped());
    }
    else {
      var newusername = req.sanitize(req.body.username);
      var newmail = req.sanitize(req.body.email);
      var newpassword = req.sanitize(req.body.password);
      var newcredit = req.sanitize(req.body.credit);

      // Yearly user fee automatically set one year registration
      var date = new Date();
      if (date.getMonth() == 11) {
        var duedate = new Date(date.getFullYear() + 1, 0, 1);
      }
      else {
        var duedate = new Date(date.getFullYear() + 1, date.getMonth(), date.getDate());
      }

      bcrypt.hash(newpassword, saltRounds, function(err, hash){
        var newUser = new User({
          username: newusername,
          email: newmail,
          password: hash,
          credit: newcredit,
          duedate: duedate,
          admin: req.body.admin,
        });

        newUser.save(function(err){
          if (err){res.sendStatus(400);
            return console.error(err);
          };
          res.status(201);
          res.json(newUser);
        });
      });
    }
  }
  else {
    res.status(400);
    return console.log("Insufficient data!");
  }
}];

// Delete all users. Not implemented in front but nice to have for testing
exports.delete_all_users = function(req, res){
  User.deleteMany({}, function(err){
    if (err) {
      res.sendStatus(404);
      return console.error(err);
    }
    res.status(204);
    res.json();
  });
}

// Delete one user's profile
exports.delete_profile = function(req, res){
  console.log(req.params.id);
  User.findByIdAndDelete(req.params.id, function(err, user){
    if (err){
      res.sendStatus(404);
      return console.error(err);
    }
    else {
      if (!user){
        res.status(404);
      }
      else{
        res.status(204);
        res.json();
      }
    }
  });
}

// Modify an user's profile
exports.modify_profile = [
  oneOf([check('email').isEmail().withMessage("Sähköpostiosoite vaadittu"),
  check('username').isLength({min: 4}).withMessage("Käyttäjätunnuksen minimipituus on 5 merkkiä"),
  check('password').isLength({min: 4}).withMessage("Salasanan minimipituus on 5 merkkiä"),
  check('credit').isCreditCard().withMessage("Olemme köyhiä, syötäthän oikean luottokortin tjsp"),
  check('admin').isBoolean().withMessage("Admin ei voi olla muuta kuin kyllä/ei arvo!"),
  check('duedate').isAfter().withMessage("Eräpäivä ei voi olla mennyt jo!")]),
  function(req, res){
    if (req.body && (req.body.username || req.body.email || req.body.password || req.body.credit || req.body.admin || req.body.duedate)) {
      var errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.sendStatus(422)
        return console.error(errors.mapped());
      }
      else {
        // Changing user's password
        if (req.body.password){
          User.findOne({'_id': req.params.id}, function (err, user) {
            if (err) {
              res.sendStatus(404);
              return console.error(err);
            };
            if (!user) {
              res.sendStatus(404);
              return console.error(err);
            }
            else {
              var newpassword = req.sanitize(req.body.password);
              bcrypt.hash(newpassword, saltRounds, function(err, hash){
                user.password = hash;
                user.save(function(err){
                  if (err){
                    res.sendStatus(400);
                    return console.error(err);
                  };
                  res.status(200);
                  res.json(user);
                });
              });
            }
          });
        }
        // Changing admin status needs admin token
        else if (req.body.admin){
          var token = req.headers.authorization.slice(7, req.headers.authorization.length);
              jwt.verify(token, secret, function(err, decoded) {
                if (err) res.sendStatus(401);
                else {
                  if (decoded.admin){
                    User.findOne({'_id': req.params.id}, function (err, user) {
                      if (err) {
                        res.sendStatus(404);
                        return console.error(err);
                      };
                      if (!user) {
                        res.sendStatus(404);
                        return console.error(err);
                      }
                      else {
                          user.admin = req.body.admin;
                          user.save(function(err){
                            if (err){
                              res.sendStatus(400);
                              return console.error(err);
                            };
                            res.status(200);
                            res.json(user);
                          });
                        }
                      });
                    }
                    else {
                      res.sendStatus(401);
                    }
                }
            });
          }
        // Anything else
        else {
          User.findByIdAndUpdate(req.params.id, req.body, {'new':true}, function (err, user) {
            if (err) {
              res.sendStatus(400);
              return console.error(err);
            };
            if (!user) {
              res.sendStatus(404);
              return console.error(err);
            }
            else {
              res.status(200);
              res.json(user);
            }
          });
        }
      }
    }
    else {
      res.status(400);
      return console.error("Insufficient data!");
    }
  }];
