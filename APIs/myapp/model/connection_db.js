// const mysql = require('mysql');
// // const connection = mysql.createPool({
// //         host: 'localhost',
// //         user: 'root',
// //         password: 'insu0418',
// //         port: 3306,
// //         database: 'db'
// //     });
// const connection = mysql.createConnection ({
//     host: 'localhost',
//     user: 'root',
//     password: 'insu0418',
//     port: 3306,
//     database: 'db'
// });

// connection.connect((err) => {
//   if (err) {
//       console.error('Error connecting to MySQL: ', err);
//       return;
//   }

//     console.log('Connected to MySQL');
// });

// module.exports = connection;

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "insu0418",
  port: 3306,
  database: "db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
try {
  connection_data = pool.getConnection();
  console.log("connected sucessfully");
} catch (err) {
  console.error("Error connecting to MySQL: ", err);
  return;
}

module.exports = pool;
