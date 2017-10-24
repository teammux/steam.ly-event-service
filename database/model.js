const Promise = require('bluebird');
const db = require('./index.js');

const createEvent = (event) => {
  let newEvent = new db.UserClickEvent(event);
  return newEvent.save();
};

const createDailyClickSummary = (summary) => {
  let newSummary = new db.DailyClickSummary(summary);
  return newSummary.save();
};

const findOrCreateDailyClickSummary = (dayNumber) => {
  return db.DailyClickSummary.findOne({ day_number: dayNumber })
    .then((result) => {
      if (result === null) {
        return db.UserClickEvent.find({ day_number: dayNumber })
      }
    })
    .then((results) => {
      let recoCount = 0;
      let randCount = 0;
      for (let event of results) {
        if (event.is_recommand) {
          recoCount++;
        } else {
          randCount++;
        }
      }
      let newSummary = new db.DailyClickSummary({ reco_clicks: recoCount, rand_clicks: randCount, day_number: dayNumber });
      return newSummary.save();
    })
}; 

module.exports = {
  createEvent: createEvent,
  findOrCreateDailyClickSummary: findOrCreateDailyClickSummary
};