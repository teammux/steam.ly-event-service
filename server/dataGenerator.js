const request = require('request');

let count = 0;

let postData = { type: 'user_click' };

let options = {
  method: 'post',
  body: postData,
  json: true,
  url: 'http://localhost:3000/events'
}

const generateData = () => {
  let seed = Math.random();
  postData.is_recommand = seed >= 0.3 ? true : false;
  postData.user_id = Math.floor(seed * seed * 10000);
  postData.item_id = Math.floor(seed * 1000);
  postData.date = date;
  count++;
  request(options, (err, res, body) => {
    console.log(postData, count);
  });
};

let date = new Date();

const timeGoes = () => {
  if (count < 10000) {
    setTimeout(() => {
      timeGoes();
    },10);
  }
  generateData();
  generateData();
  generateData();
  date = new Date(date.getTime() + 100 * 1000);
};

timeGoes();
