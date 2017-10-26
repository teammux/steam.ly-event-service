const Promise = require('bluebird');
const db = require('./index.js');
const elasticsearch = require('elasticsearch');
const esclient = new elasticsearch.Client({
  host: 'localhost:9200'
});

const EventMap = {
  'user_click': db.UserClickEvent
};

const DailySummaryMap = {
  'click': db.DailyClickSummary
}

let currentTime;
let clickEventCache = [];
const checkDate = (dateString) => {
  let date = new Date(dateString);
  if (currentTime === undefined) {
    currentTime = date.getTime() - date.getTime() % (86400 * 1000);
  } else if (date.getTime() - currentTime > 86400 * 1000) {
    createDailyClickSummary(clickEventCache)
      .then((result) => {
        console.log('daily summary generated');
        esclient.create({
          id: result.id,
          index: 'daily_summary',
          type: 'click',
          body: {
            reco_clicks: result.reco_clicks,
            rand_clicks: result.rand_clicks,
            date: result.date
          }
        }, (error, response) => {
          // console.log(error, response);
        })
      });
    clickEventCache = [];
    currentTime = date.getTime() - date.getTime() % (86400 * 1000);
  }
};

const createEvent = (event) => {
  let newEvent = new EventMap[event.type](event);
  if (event.type === 'user_click') {
    clickEventCache.push(event);
  }
  checkDate(event.date);
  return newEvent.save();
};

const createDailyClickSummary = (events) => {
  let recoCount = 0;
  let randCount = 0;
  for (let event of events) {
    if (event.is_recommand) {
      recoCount++;
    } else {
      randCount++;
    }
  }
  let newSummary = new db.DailyClickSummary({ reco_clicks: recoCount, rand_clicks: randCount, date: events[0].date });
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
      return createDailyClickSummary(results);
    })
};

const findDailySummary = (options) => {
  return DailySummaryMap[options.type].find().sort({ date: -1 }).limit(parseInt(options.amount));
};

module.exports = {
  createEvent,
  findDailySummary
};