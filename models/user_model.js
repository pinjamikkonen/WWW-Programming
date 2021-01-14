// Pinja Mikkonen
// WWW-programming 2019 spring
// 10ECTS coursework

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean,
    required: true,
    default: false,
  },
  credit: {
    type: String,
    required: true
  },
  duedate: {
    type: Date,
    required: true
  }
});

userSchema.virtual('links').get(function() {
  return [{
    'self': 'localhost:3000/api/users/' + this._id
  }];
});

userSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password;
  }
});

module.exports = mongoose.model('User', userSchema);
