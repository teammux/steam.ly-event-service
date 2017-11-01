const assert = require('assert');
const model = require('../database/model.js');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect('mongodb://localhost/steamly', {
  useMongoClient: true
});
const db = mongoose.connection;
describe('database', function() {

  before( function() {
    db.collections['events'].drop();
  });

  after( function() {
    db.collections['events'].drop();
  });

  it('should insert 1 event correctly', function(done) {
    model.createEvents([{
      type: 'user_click',
      item_id: 1,
      user_id: 1,
      is_recommended: false,
      date: new Date()
    }])
      .then(function() {
        done();
      })
      .catch(function(err) {
        done(err);
      })
  });

  it('should insert 5 events correctly', function(done) {
    model.createEvents([
      { type: 'user_click', item_id: 1, user_id: 1, is_recommended: false, date: new Date() },
      { type: 'user_click', item_id: 1, user_id: 1, is_recommended: false, date: new Date() },
      { type: 'user_click', item_id: 1, user_id: 1, is_recommended: false, date: new Date() },
      { type: 'user_click', item_id: 1, user_id: 1, is_recommended: false, date: new Date() },
      { type: 'user_click', item_id: 1, user_id: 1, is_recommended: false, date: new Date() }
    ])
      .then(function(results) {
        assert.equal(results.length, 5);
        done();
      })
      .catch(function(err) {
        done(err);
      })
  });


});
