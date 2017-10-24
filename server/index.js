const express = require('express');
const app = express();
const model = require('../database/model.js')
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/events', (req, res) => {
  console.log(req.body);
  model.createEvent(req.body)
    .then((result) => {
      console.log(result);
      res.status(201).end();
    })
});

app.listen(3000, () => {
  console.log('listening to port ', 3000);
});