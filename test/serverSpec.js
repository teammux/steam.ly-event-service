const assert = require('assert');
const request = require('request');

describe('databse', function() {
  
  it('should handle post event correctly', function(done) {
    let options = {
      url: 'http://localhost:3000/events',
      body: [{
        type: 'user_click',
        item_id: 1,
        user_id: 1,
        is_recommended: false,
        date: new Date()
      }],
      json: true
    }
    request.post(options, function(err, res, body) {
      if (res.statusCode === 201) {
        done();
      } else {
        done(res.statusCode);
      }
    });
  });

});