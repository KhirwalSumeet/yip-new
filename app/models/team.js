// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var teamSchema = new Schema({
  useremail: String,
  name: String,
  next: Number,
  firstStudent: {
    name: String,
    contact: String,
    email: String
  },
  secondStudent: {
    name: String,
    contact: String,
    email: String
  },
  thirdStudent: {
    name: String,
    contact: String,
    email: String
  },
  isPaid: Number,
  submitted: Number
});


teams = mongoose.model('teams', teamSchema);
module.exports = teams;