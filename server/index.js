const express = require('express');
const app = express();
const db = require('../database/index.js')

app.listen(3000, () => {
  console.log('listening to port ', 3000);
});