const express = require('express');
const model = require('../database/model.js')
const bodyParser = require('body-parser');
const elasticSearch = require('../elasticSearch/index.js');
const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  for (let i = 0; i < os.cpus().length; i++) {
    var worker = cluster.fork();
    
    worker.on('message', function(message) {
      model.fillEventCache(message);
    });
  }

  cluster.on('exit', () => {
    cluster.fork();
  })

  return;
}

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/events', (req, res) => {
  process.send(req.body);
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

const port = 3000;

app.listen(port, () => {
  console.log(`listening to port ${port} on worker${process.pid}`);
});