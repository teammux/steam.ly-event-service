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
let count = 0;
let tempId = 0;
let stash = [];
let date = new Date();

const generateData = () => {
  let seed = Math.random();
  let postData = { type: 'user_click' };
  postData.is_recommended = seed >= 0.3 ? true : false;
  postData.user_id = count;
  postData.item_id = count;
  postData.date = date;
  count++;
  tempId++;
  date = new Date(date.getTime() + 70 * 1000);// add 80 seconds, make time goes
  let messageEntry = {
    Id: `${tempId}`, /* required */
    MessageBody: JSON.stringify(postData), /* required */
    DelaySeconds: 0,
    MessageAttributes: {},
    MessageDeduplicationId: `${count}`,
    MessageGroupId: '1'
  }
  stash.push(messageEntry);
};

let start = process.hrtime();

const timeGoes = () => {
  // generateData();
  // generateData();
  // generateData();
  // generateData();
  // generateData();
  // generateData();
  // generateData();
  // generateData();
  // generateData();
  generateData();
  log(`progress: ${count}/${TargetCount}`);
  if (stash.length >= 10) {
  //   let options = {
  //     url: 'http://localhost:3000/events',
  //     body: stash,
  //     json: true
  //   }
  //   request.post(options, (err, res, body) => {
  //     // console.log(res.statusCode);
  //   });
  //   stash = [];
  // }

    var params = {
      Entries: stash,
      QueueUrl: queueURL /* required */
    };
    sqs.sendMessageBatch(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });
    stash = [];
    tempId = 0;
  }
  if (count < TargetCount) {
    setTimeout(() => {
      timeGoes()
    }, 1);
  } else {
    log(`complete ${TargetCount} rows `)
    let finish = process.hrtime(start);
    console.log(`${Math.round((finish[0]*1000) + (finish[1]/1000000))} ms used`);
    // process.exit()
  }
};

timeGoes();
