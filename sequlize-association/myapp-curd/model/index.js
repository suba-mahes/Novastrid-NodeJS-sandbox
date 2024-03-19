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
db.actor = require("./actor_model.js")(sequelize,Sequelize);
db.movie = require("./movie_model.js")(sequelize,Sequelize);
db.actor_movie = require("./actor_movie_model.js")(sequelize,Sequelize,db.actor,db.movie);

// db.actor.belongsToMany(db.movie);
// db.movie.belongsToMany(db.actor);

db.actor.belongsToMany(db.movie,{through : db.actor_movie ,foreignKey: 'actor_id' });
db.movie.belongsToMany(db.actor, { through: db.actor_movie ,foreignKey: 'movie_id' });

//{foreignKey: 'user_id'}

module.exports = db;
