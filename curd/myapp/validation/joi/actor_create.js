const Joi = require("joi");


exports.create_actor_schema = Joi.object({
    first_name: Joi.string().alphanum().min(3).max(30).required(),
    last_name: Joi.string().alphanum().min(3).max(30).required(),
    movies: Joi.array().items({
      movie_name: Joi.string().required()
    })
  });