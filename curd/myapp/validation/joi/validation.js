var actor_schema = require("./actor_create");
var movie_schema = require("./movie_create");
var actor_movie_schema = require("./actor_movie");


module.exports.validation_actor = (data)=>{
    return actor_schema.create_actor_schema.validate(data);
}

module.exports.validation_movie = (data)=>{
    return movie_schema.create_movie_schema.validate(data);
}

module.exports.validation_actor_movie = (data)=>{
    return actor_movie_schema.actor_movie_schema.validate(data);
}