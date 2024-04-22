const Joi = require("joi");

exports.create_actor_schema = Joi.object({
  first_name: Joi.string().alphanum().min(3).max(30).required().messages({
    "any.required": "first_name is required",
    "string.empty": "first name cannot be empty",
    "string.min": "first name should have atleast 3 minimum characters",
    "string.max": "first name should have only 3o maximum characters",
    "string.alphanum": "first name should be alpha numeric",
  }),
  last_name: Joi.string().alphanum().min(3).max(30).required().messages({
    "any.required": "last_name is required",
    "string.empty": "last name cannot be empty",
    "string.min": "last name should have atleast 3 minimum characters",
    "string.max": "last name should have only 3o maximum characters",
    "string.alphanum": "last name should be alpha numeric",
  }),
  movies: Joi.array().items({
    movie_name: Joi.string().required().messages({
      "any.required": "movie name is required",
      "string.empty": "movie name cannot be empty",
    }),
  }),
});

exports.create_actor_movie_id_schema = Joi.object({
  first_name: Joi.string().alphanum().min(3).max(30).required().messages({
    "any.required": "first_name is required",
    "string.empty": "first name cannot be empty",
    "string.min": "first name should have atleast 3 minimum characters",
    "string.max": "first name should have only 3o maximum characters",
    "string.alphanum": "first name should be alpha numeric",
  }),
  last_name: Joi.string().alphanum().min(3).max(30).required().messages({
    "any.required": "last_name is required",
    "string.empty": "last name cannot be empty",
    "string.min": "last name should have atleast 3 minimum characters",
    "string.max": "last name should have only 3o maximum characters",
    "string.alphanum": "last name should be alpha numeric",
  }),
  movie_id: Joi.array().items(
    Joi.number().required().messages({
      "any.required": "movie id is required",
      "number.empty": " cannot be empty",
    })
  ),
});
