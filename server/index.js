const express = require('express');
const model = require('../database/model.js')
const bodyParser = require('body-parser');
const cluster = require('cluster');
const os = require('os');
const AWS = require('aws-sdk');
require('dotenv').config({path: '.env'});

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

AWS.config = new AWS.Config({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, 
  region: process.env.AWS_REGION
})
const consumer = require('sqs-consumer');
const sqs = new AWS.SQS({ apiVersion: process.env.AWS_SQS_API_VERSION });
const queueURL = process.env.INCOMING_QUEUE_URL;

const sqsApp = consumer.create({
  queueUrl: queueURL,
  visibilityTimeout: 30,
  batchSize: 10,
  waitTimeSeconds: 0,
  handleMessage: (message, done) => {
    process.send(JSON.parse(message.Body));
    model.createEvents(JSON.parse(message.Body), cluster.worker.id)
      .then(() => {
        done();
      })
  },
  sqs: sqs
});

sqsApp.on('message_received', (message) => {
  // console.log(message, 'handled by worker');
});

sqsApp.on('processing_error', (err, message) => {
  console.log('error when processing', message.MessageId, ':', err.message);
});
 
sqsApp.on('error', (err) => {
  console.log(err.message);
});
 
sqsApp.start();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/events', (req, res) => {
  if (Array.isArray(req.body)) {
    process.send(req.body);
    model.createEvents(req.body, cluster.worker.id)
      .then((results) => {
        res.status(201).end();
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  } else {
    res.status(400).end();
  }
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

app.get('/hello', (req, res) => {
  res.status(200).send('hello');
});

const port = process.env.PORT||3000;

app.listen(port, () => {
  console.log(`listening to port ${port} on worker${process.pid}`);
});