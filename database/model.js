const Promise = require('bluebird');
const db = require('./index.js');
const elasticSearch = require('../elasticSearch/index.js');
const MillionsecondsPerDay = 86400 * 1000;

const EventMap = {
  'user_click': db.UserClickEvent
};

const EventCacheMap = {
  'user_click': [],
  workerId: null
};

const DailySummaryMap = {
  'click': db.DailyClickSummary
};

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

const fillEventCache = (events) => {
  for (let event of events) {
    EventCacheMap[event.type].push(event);
    checkDate(event.date);
  }
}

const createEvent = (event, workerId) => {
  EventCacheMap[event.type].push(event)
  EventCacheMap.workerId = workerId;
  if (EventCacheMap[event.type].length >= 50) {
    createEvents(EventCacheMap[event.type], EventCacheMap.workerId)
      .then()
      .catch( err => console.log(err) );
    EventCacheMap[event.type] = [];
  }
}

const createEvents = (events, workerId) => {
  elasticSearch.createEvents(events);
  elasticSearch.createPerformanceData({ type: 'worker_workload', worker_id: workerId, date: events[0].date });
  return EventMap[events[0].type].insertMany(events);
};

const createDailySummary = () => {
  for (let eventType of Object.keys(DailySummaryGeneratorMAp)) {
    DailySummaryGeneratorMAp[eventType](EventCacheMap[eventType]);
    EventCacheMap[eventType] = [];
  }
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
      let finish = process.hrtime(start);
      let timeUsed = Math.round((finish[0]*1000) + (finish[1]/1000000));
      elasticSearch.createPerformanceData({ type: 'daily_click_summary', time_used: timeUsed, date: new Date(currentTime) });
      console.log(`daily summary generated for ${result.date}`);
    })
    .catch(err => console.log(err));
};

const DailySummaryGeneratorMAp = {
  'user_click': createDailyClickSummary
};

const findDailySummary = (options) => {
  return DailySummaryMap[options.type].find().sort({ date: -1 }).limit(parseInt(options.amount));
};

module.exports = {
  createEvent,
  createEvents,
  fillEventCache,
  findDailySummary
};