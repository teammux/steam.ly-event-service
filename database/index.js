const Promise = require('bluebird');
const _ = require('lodash');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
require('dotenv').config({path: '.env.dev'});

mongoose.connect(process.env.DB_URL, {
  useMongoClient: true
});
const db = mongoose.connection;

db.on('error', function() {
  console.log('mongoose connection error');
});

db.once('open', function() {
  // console.log('mongoose connected successfully');
});

const userClickEventSchema = mongoose.Schema({
  user_id: Number,
  item_id: Number,
  is_recommended: Boolean,
  date: Date
});
const UserClickEvent = mongoose.model('Event', userClickEventSchema);

const dailyClickSummarySchema =  mongoose.Schema({
  reco_clicks: Number,
  rand_clicks: Number,
  date: Date
})
const DailyClickSummary = mongoose.model('DailyClickSummary', dailyClickSummarySchema);

module.exports = {
  db: db,
  UserClickEvent: UserClickEvent,
  DailyClickSummary: DailyClickSummary
}