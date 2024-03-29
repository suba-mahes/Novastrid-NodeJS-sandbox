const db_config = require("./connection.js");

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


try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
}
catch (error) {
    console.error('Unable to connect to the database:', error);
}


const db ={};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user_model.js")(sequelize,Sequelize);
db.user_address = require("./user_address_model.js")(sequelize,Sequelize);

db.user.hasOne(db.user_address,{foreignKey: 'user_id'});
db.user_address.belongsTo(db.user, { foreignKey: 'user_id' });


db.user_table = require("./user_table_model.js")(sequelize,Sequelize);
db.user_address_table = require("./user_address_table_model.js")(sequelize,Sequelize);

db.user_table.hasMany(db.user_address_table,{foreignKey: 'user_id'});
db.user_address_table.belongsTo(db.user_table, { foreignKey: 'user_id' });


db.actor = require("./actor_model.js")(sequelize,Sequelize);
db.movie = require("./movie_model.js")(sequelize,Sequelize);
db.actor_movie = require("./actor_movie_model.js")(sequelize,Sequelize);


db.actor.belongsToMany(db.movie,{through : db.actor_movie ,foreignKey: 'actor_id' });
db.movie.belongsToMany(db.actor, { through: db.actor_movie ,foreignKey: 'movie_id' });

module.exports = db;
