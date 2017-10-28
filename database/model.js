const Promise = require('bluebird');
const db = require('./index.js');
const elasticSearch = require('../elasticSearch/index.js');
const MillionsecondsPerDay = 86400 * 1000;

const EventMap = {
  'user_click': db.UserClickEvent
};

let clickEventCache = [];
const EventCacheMap = {
  'user_click': clickEventCache
}

const DailySummaryMap = {
  'click': db.DailyClickSummary
}

let currentTime;
const checkDate = (dateString) => {
  let date = new Date(dateString);
  if (currentTime === undefined) {
    currentTime = date.getTime() - date.getTime() % MillionsecondsPerDay;
  } else if (date.getTime() - currentTime > MillionsecondsPerDay) {
    createDailySummary();
    currentTime = date.getTime() - date.getTime() % MillionsecondsPerDay;
  }
};

const createEvents = (events) => {
  let promises = [];
  for (let event of events) {
    EventCacheMap[event.type].push(event);
    checkDate(event.date);
    let newEvent = new EventMap[event.type](event);
    promises.push(newEvent.save());
  }
  return Promise.all(promises);
};

const createDailySummary = () => {
  createDailyClickSummary(clickEventCache);
  clickEventCache = [];
};

const createDailyClickSummary = (events) => {
  let start = process.hrtime();
  let recoCount = 0;
  let randCount = 0;
  for (let event of events) {
    if (event.is_recommended) {
      recoCount++;
    } else {
      randCount++;
    }
  }
  let newSummary = new db.DailyClickSummary({ reco_clicks: recoCount, rand_clicks: randCount, date: events[0].date });
  newSummary.save()
    .then((result) => {
      elasticSearch.createDailySummary(result);
      elasticSearch.createPerformanceData({ type: 'daily_click_summary', hrtime: process.hrtime(start), date: result.date });
      console.log('daily summary generated');
    })
    .catch(err => console.log(err));
};

const findDailySummary = (options) => {
  return DailySummaryMap[options.type].find().sort({ date: -1 }).limit(parseInt(options.amount));
};

module.exports = {
  createEvents,
  findDailySummary
};