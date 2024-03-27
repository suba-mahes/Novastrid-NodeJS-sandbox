var actor_schema = require("./actor_create_schema");
var movie_schema = require("./movie_create_schema");
var actor_movie_schema = require("./actor_movie_schema");


module.exports.validation_actor = (data)=>{
    return actor_schema.create_actor_schema.validate(data, { abortEarly: false });
}

module.exports.validation_movie = (data)=>{
    return movie_schema.create_movie_schema.validate(data, { abortEarly: false });
}

module.exports.validation_actor_movie = (data)=>{
    return actor_movie_schema.actor_movie_schema.validate(data, { abortEarly: false });
}