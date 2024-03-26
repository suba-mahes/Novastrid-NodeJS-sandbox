const Joi = require("joi");


exports.actor_movie_schema = Joi.object({
    actor_id: Joi.number().min(1).max(30).required(),
    movie_id: Joi.number().min(1).max(30).required()
  });