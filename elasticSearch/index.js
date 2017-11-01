const elasticsearch = require('elasticsearch');
const esclient = new elasticsearch.Client({
  host: 'localhost:9200'
});

const createEvents = (events) => {
  let bulkBody = [];
  for (let event of events) {
    bulkBody.push({ 
      index: {
        _id: event.id,
        _index: 'event',
        _type: 'user_click'
      }
    });
    bulkBody.push({
      user_id: event.user_id,
      item_id: event.item_id,
      is_recommended: event.is_recommended,
      date: event.date
    });
  }
  esclient.bulk({ body: bulkBody })
    .then((response) => { 
      // console.log(response)
    })
    .catch(err => console.log(err));
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