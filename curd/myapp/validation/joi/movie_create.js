const Joi = require("joi");


exports.create_movie_schema = Joi.object({
    movie_name: Joi.string().required(),
    actors: Joi.array().items({
      first_name: Joi.string().alphanum().min(3).max(30).required(),
      last_name: Joi.string().alphanum().min(3).max(30).required(),
    })
  });