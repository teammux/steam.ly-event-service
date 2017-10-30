const request = require('request');
const log = require('single-line-log').stdout;

const TargetCount = 1000;
let count = 0;

let postData = { type: 'user_click' };

let stash = [];

let options = {
  url: 'http://localhost:3000/events',
  body: stash,
  json: true
}

const generateData = () => {
  let seed = Math.random();
  postData.is_recommended = seed >= 0.3 ? true : false;
  postData.user_id = Math.floor(seed * seed * 10000);
  postData.item_id = Math.floor(seed * 1000);
  postData.date = date;
  count++;
  date = new Date(date.getTime() + 100 * 1000);// add 100 seconds(100 * 1000 ms) per time
  stash.push(postData);
};

let date = new Date();

const timeGoes = () => {
  let start = process.hrtime();
  while (count < TargetCount) {
    generateData();
    log(`progress: ${count}/${TargetCount}`);
    if (stash.length >= 100) {
      request.post(options, (err, res, body) => {
        console.log(err);
      });
      stash = [];
    }
  }
  log(`complete ${TargetCount} rows `)
  let finish = process.hrtime(start);
  console.log(`${Math.round((finish[0]*1000) + (finish[1]/1000000))} ms used`);
  // process.exit()
};

timeGoes();
