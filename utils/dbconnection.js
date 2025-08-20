var mysql = require("mysql");

// var connection = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "node_test",
// });

var connection = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "admin_popnew",
  password: "S176cje4$",
  database: "admin_popnew",
});

module.exports = connection;
