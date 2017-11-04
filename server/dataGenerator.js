const request = require('request');
const log = require('single-line-log').stdout;
const AWS = require('aws-sdk');
require('dotenv').config({path: '.env.dev'});

AWS.config = new AWS.Config({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, 
  region: process.env.AWS_REGION
})
const sqs = new AWS.SQS({ apiVersion: process.env.AWS_SQS_API_VERSION });
const queueURL = process.env.INCOMING_QUEUE_URL;

const TargetCount = 1000000;
const SpeedLevel = 20;
let count = 0;
let failedCount = 0;

let tempId = 0;
let docStash = [];
let messageStash = [];
let date = new Date();

const generateData = () => {
  let seed = Math.random();
  let event = { type: 'user_click' };
  event.is_recommended = seed >= 0.3 ? true : false;
  event.user_id = count;
  event.item_id = count;
  event.date = date;
  count++;
  tempId++;
  date = new Date(date.getTime() + 70 * 1000);// add 80 seconds, make time goes
  docStash.push(event);
};

let start = process.hrtime();

const timeGoes = () => {
  let counter = 0;
  while (counter < SpeedLevel) {
    generateData();
    counter++;
  }
  log(`progress: ${count}/${TargetCount} failed: ${failedCount}`);
  if (docStash.length >= 200) {
    let messageEntry = {
      Id: `${tempId}`,
      MessageBody: JSON.stringify(docStash),
      DelaySeconds: 0,
      MessageAttributes: {},
      MessageDeduplicationId: `${count}`,
      MessageGroupId: '1'
    }
    messageStash.push(messageEntry);
    docStash = [];
  }
  if (messageStash.length >= 10) {
    var params = {
      Entries: messageStash,
      QueueUrl: queueURL /* required */
    };
    sqs.sendMessageBatch(params, function(err, data) {
      if (err) {
        console.log(err);
      }
      if (data) {
        failedCount += data.Failed.length;
      }
    });
    messageStash = [];
    tempId = 0;
  }
  if (count < TargetCount) {
    setTimeout(() => {
      timeGoes()
    }, 0);
  } else {
    log(`complete ${TargetCount} rows `)
    let finish = process.hrtime(start);
    console.log(`${Math.round((finish[0]*1000) + (finish[1]/1000000))} ms used`);
    // process.exit()
  }
};

timeGoes();
