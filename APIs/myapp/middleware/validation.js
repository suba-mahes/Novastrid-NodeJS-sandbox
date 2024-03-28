var actor_schema = require("../validation/joi/actor_create_schema");
var movie_schema = require("../validation/joi/movie_create_schema");
var actor_movie_schema = require("../validation/joi/actor_movie_schema");
var display = require("../controller/result_display.js");


module.exports.validation_actor = (req, res, next)=>{
    const { error, value } = actor_schema.create_actor_schema.validate(req.body, { abortEarly: false });

    if(error){
        display.end_result(res,500,{"message": error.details.map(detail => detail.message)});
        return;
    }
    
    next();
}

module.exports.validation_actor_with_movie_id = (req, res, next)=>{
    const { error, value } = actor_schema.create_actor_movie_id_schema.validate(req.body, { abortEarly: false });

    if(error){
        display.end_result(res,500,{"message": error.details.map(detail => detail.message)});
        return;
    }
    
    next();
}

module.exports.validation_movie = (req, res, next)=>{
    const { error, value } = movie_schema.create_movie_schema.validate(req.body, { abortEarly: false });

    if(error){
        display.end_result(res,500,{"message": error.details.map(detail => detail.message)});
        return;
    }
    
    next();
}

module.exports.validation_movie_with_actor_id = (req, res, next)=>{
    const { error, value } = movie_schema.create_movie_with_actor_id_schema.validate(req.body, { abortEarly: false });

    if(error){
        display.end_result(res,500,{"message": error.details.map(detail => detail.message)});
        return;
    }
    
    next();
}

module.exports.validation_actor_movie = (req, res, next)=>{
    const { error, value } = actor_movie_schema.actor_movie_schema.validate(req.body, { abortEarly: false });

    if(error){
        display.end_result(res,500,{"message": error.details.map(detail => detail.message)});
        return;
    }
    
    next();
}