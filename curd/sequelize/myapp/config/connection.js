//const mysql = require('mysql');

const connection = {
    host: 'localhost',
    user: 'root',
    password: 'insu0418',
    database: 'db_sequlize',
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

// connection.connect((err) => {
//   if (err) {
//       console.error('Error connecting to MySQL: ', err);
//       return;
//   }

//     console.log('Connected to MySQL');
// });

module.exports = connection;
