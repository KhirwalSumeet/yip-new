var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'yipnew'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/yip'
  },

  test: {
    root: rootPath,
    app: {
      name: 'yipnew'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/yipnew-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'yipnew'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/yipnew-production'
  }
};

module.exports = config[env];
