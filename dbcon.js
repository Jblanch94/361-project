var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  timeout         : 10000,
  host            : 'remotemysql.com',
  user            : 'KTPYl34i4G',
  password        : 'ePW0tFCqDT',
  database        : 'KTPYl34i4G'
});

module.exports.pool = pool;
