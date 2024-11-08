//db.js
const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: '',
  password: '',
  database: 'board'
});

module.exports = db;