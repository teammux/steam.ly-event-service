const request = require('request');
const log = require('single-line-log').stdout;

const TargetCount = 100;
let count = 0;
let userId = 0;
let itemId = 0;
let stash = [];
let date = new Date();

const generateData = () => {
  let seed = Math.random();
  let postData = { type: 'user_click' };
  postData.is_recommended = seed >= 0.3 ? true : false;
  postData.user_id = userId;
  postData.item_id = itemId;
  postData.date = date;
  count++;
  userId++;
  itemId++;
  date = new Date(date.getTime() + 80 * 1000);// add 80 seconds, make time goes
  stash.push(postData);
};

let start = process.hrtime();

const timeGoes = () => {
  generateData();
  generateData();
  generateData();
  generateData();
  generateData();
  log(`progress: ${count}/${TargetCount}`);
  if (stash.length >= 100) {
    let options = {
      url: 'http://localhost:3000/events',
      body: stash,
      json: true
    }
    request.post(options, (err, res, body) => {
      // console.log(res.statusCode);
    });
    stash = [];
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
