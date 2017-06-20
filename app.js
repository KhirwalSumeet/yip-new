

var express = require('express'),
  config = require('./config/config'),
  glob = require('glob'),
  mongoose = require('mongoose');

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});
var app = express();

module.exports = require('./config/express')(app, config);
var passport = require('passport'),
  session = require("express-session");
  app.use(session({ secret: 'barc2017@KGP' ,saveUninitialized: false, resave: false})); // session secret
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions
require('./config/passport')(passport); // pass passport for configuration

app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});

