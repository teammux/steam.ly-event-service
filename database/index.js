const Promise = require('bluebird');
const _ = require('lodash');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/steamly');
var db = mongoose.connection;

db.on('error', function() {
  console.log('mongoose connection error');
});

db.once('open', function() {
  console.log('mongoose connected successfully');
});