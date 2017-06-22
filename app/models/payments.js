// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var paymentschema = new Schema({
  email: String,
  mode: String,
  bankName: String,
  bankBranch: String,
  amount: String,
  transactionId: String,
  date: String,
  status: String,
  teamIds: Array
});


payments = mongoose.model('payments', paymentschema);
module.exports = payments;