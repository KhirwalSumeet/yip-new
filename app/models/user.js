// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var userSchema = new Schema({
  email: String,
  password: String,
  details:{
  	principal:{
  		name: String,
  		contact: String,
  		email: String
  	},
  	teacher:{
  		name: String,
  		contact: String,
  		email: String
  	},
  	school:{
  		address: String,
  		contact: String,
  		city: String,
  		state: String
  	}
  }
});


users = mongoose.model('users', userSchema);
module.exports = users;