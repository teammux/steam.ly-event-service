const express = require('express');
const app = express();
const model = require('../database/model.js')
const bodyParser = require('body-parser');
const elasticSearch = require('../elasticSearch/index.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/events', (req, res) => {
  model.createEvents(req.body)
    .then((results) => {
      elasticSearch.createEvents(results);
      res.status(201).end();
    })
    .catch((err) => {
      res.status(500).send(err);
    });
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