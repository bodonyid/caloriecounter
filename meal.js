'use strict';

var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'calorie_counter_database',
  timezone: 'utc'
});

connection.connect();

function add(meal, cb) {
  connection.query('INSERT INTO meal SET ?', meal, cb);
}

function getAll(cb) {
  connection.query('SELECT * FROM meal', cb);
}

function filterByDate(date, cb) {
  connection.query('SELECT * FROM meal WHERE LEFT(date,10) = ?', date, cb);
}

function del(id, cb) {
  connection.query('DELETE FROM meal WHERE id = ?', id, cb);
}

module.exports = {
  add: add,
  getAll: getAll,
  filter: filterByDate,
  del: del
};
