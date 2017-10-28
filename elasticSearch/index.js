const elasticsearch = require('elasticsearch');
const esclient = new elasticsearch.Client({
  host: 'localhost:9200'
});

const createEvent = (event) => {
  esclient.create({
    id: event.id,
    index: 'event',
    type: 'user_click',
    body: {
      user_id: event.user_id,
      item_id: event.item_id,
      is_recommended: event.is_recommended,
      date: event.date
    }
  }, (error, response) => {
    // console.log(error, response);
  })
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
  esclient.create({
    id: performanceDataId,
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
  createEvent,
  createDailySummary,
  createPerformanceData
}