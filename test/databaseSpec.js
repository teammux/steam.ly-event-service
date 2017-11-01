const assert = require('assert');
const model = require('../database/model.js');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect('mongodb://localhost/steamly', {
  useMongoClient: true
});
const db = mongoose.connection;
describe('databse', function() {

  before(() => {
    db.collections['events'].drop();
  });

  after(() => {
    db.collections['events'].drop();
  });

  it('should insert 1 event correctly', function() {
    model.createEvents([{
      type: 'user_click',
      item_id: 1,
      user_id: 1,
      is_recommended: false,
      date: new Date()
    }])
      .then(() => {
        assert(true);
      })
      .catch(() => {
        assert(false);
      })
  });

  it('should insert 5 events correctly', function() {
    model.createEvents([
      { type: 'user_click', item_id: 1, user_id: 1, is_recommended: false, date: new Date() },
      { type: 'user_click', item_id: 1, user_id: 1, is_recommended: false, date: new Date() },
      { type: 'user_click', item_id: 1, user_id: 1, is_recommended: false, date: new Date() },
      { type: 'user_click', item_id: 1, user_id: 1, is_recommended: false, date: new Date() },
      { type: 'user_click', item_id: 1, user_id: 1, is_recommended: false, date: new Date() }
    ])
      .then((results) => {
        assert(results.length === 5);
      })
      .catch(() => {
        assert(false);
      })
  });


});
