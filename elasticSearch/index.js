const elasticsearch = require('elasticsearch');
const esclient = new elasticsearch.Client({
  host: 'localhost:9200'
});

const ELASTIC_SEARCH_BULK_THRESHOLD = 5000 * 2;// 1 doc takes 2 position

const EventCacheMap = {
  'user_click': []
};
const createEvents = (events) => {
  for (let event of events) {
    EventCacheMap[event.type].push({ 
      index: {
        _index: 'event',
        _type: event.type
      }
    });
    EventCacheMap[event.type].push(event);
    if (EventCacheMap[event.type].length >= ELASTIC_SEARCH_BULK_THRESHOLD) {
      esclient.bulk({ body: EventCacheMap[event.type] })
        .then((response) => { 
          // console.log(response);
        })
        .catch(err => console.log(err));
      EventCacheMap[event.type] = [];
    }
  }
};

const createDailySummary = (dailySummary) => {
  esclient.create({
    id: dailySummary.id,
    index: 'daily_summary',
    type: 'click',
    body: {
      reco_clicks: dailySummary.reco_clicks,
      rand_clicks: dailySummary.rand_clicks,
      date: dailySummary.date
    }
  }, (error, response) => {
    // console.log(error, response);
  })
};

let performanceDataId = 0;
const createPerformanceData = (options) => {
  esclient.index({
    // id: performanceDataId,
    index: 'performance_data',
    type: options.type,
    body: {
      time_used: Math.round((options.hrtime[0]*1000) + (options.hrtime[1]/1000000)),
      date: options.date
    }
  }, (error, response) => {
    // console.log(error, response);
  })
  performanceDataId++;
};

module.exports = {
  createEvents,
  createDailySummary,
  createPerformanceData
}