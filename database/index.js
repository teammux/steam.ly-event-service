const Promise = require('bluebird');
const _ = require('lodash');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/rss', { useMongoClient: true })
  .then((db) => {
    console.log('mongoose connected successfully');
  })
  .catch((err) => {
    console.log(err);
  });