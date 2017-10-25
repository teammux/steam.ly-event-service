const Promise = require('bluebird');
const _ = require('lodash');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/steamly');
const db = mongoose.connection;

db.on('error', function() {
  console.log('mongoose connection error');
});

db.once('open', function() {
  console.log('mongoose connected successfully');
});

const userClickEventSchema = mongoose.Schema({
  user_id: Number,
  item_id: Number,
  is_recommand: Boolean,
  date: Date
});
const UserClickEvent = mongoose.model('Event', userClickEventSchema);

const dailyClickSummarySchema =  mongoose.Schema({
  item_id: Number,
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