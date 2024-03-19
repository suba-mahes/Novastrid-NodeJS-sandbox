
const connection = {
    host: 'localhost',
    user: 'root',
    password: 'insu0418',
    database: 'db_many_to_many',
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

module.exports = connection;
