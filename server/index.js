const express = require('express');
const app = express();
const model = require('../database/model.js')
const bodyParser = require('body-parser');
const elasticsearch = require('elasticsearch');
const esclient = new elasticsearch.Client({
  host: 'localhost:9200'
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/events', (req, res) => {
  model.createEvent(req.body)
    .then((result) => {
      esclient.create({
        id: result.id,
        index: 'event',
        type: 'user_click',
        body: {
          user_id: result.user_id,
          item_id: result.item_id,
          is_recommended: result.is_recommended,
          date: result.date
        }
      }, (error, response) => {
        // console.log(error, response);
      })
      res.status(201).end();
    })
});

app.get('/dailySummaries', (req, res) => {
  if (req.query.type && req.query.amount) {
    model.findDailySummary(req.query)
      .then((reuslts) => {
        res.status(200).json(reuslts);
      })
  } else {
    res.status(400).end();
  }
});

app.listen(3000, () => {
  console.log('listening to port ', 3000);
});