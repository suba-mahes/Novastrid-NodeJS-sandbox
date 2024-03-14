const db_config = require("../config/connection");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(db_config.database, db_config.user, db_config.password, {
    host : db_config.host,
    dialect: db_config.dialect,
    operatorsAliases: false,
    pool: {
        max: db_config.pool.max,
        min: db_config.pool.min,
        acquire: db_config.pool.acquire,
        idle: db_config.pool.idle
    }
});


const db ={};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("./user_model.js")(sequelize,Sequelize);
db.user_address = require("./user_address_model.js")(sequelize,Sequelize);

db.user.hasOne(db.user_address,{foreignKey: 'user_id'});
db.user_address.belongsTo(db.user, { foreignKey: 'user_id' });


module.exports = db;
