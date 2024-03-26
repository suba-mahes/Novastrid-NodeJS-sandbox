const Joi = require("joi");


exports.actor_movie_schema = Joi.object({
    actor_id: Joi.number().min(1).required().messages({
      "any.required" : "actor id is required",
      "number.empty" : "actor id cannot be empty"
    }),
    movie_id: Joi.number().min(1).required().messages({
      "any.required" : "movie id is required",
      "number.empty" : "movie id cannot be empty"
    })
  });