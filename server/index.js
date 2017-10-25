const express = require('express');
const app = express();
const model = require('../database/model.js')
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/events', (req, res) => {
  model.createEvent(req.body)
    .then((result) => {
      res.status(201).end();
    })
});

app.get('/dailySummaries', (req, res) => {
  console.log(req.query);
});

app.listen(3000, () => {
  console.log('listening to port ', 3000);
});