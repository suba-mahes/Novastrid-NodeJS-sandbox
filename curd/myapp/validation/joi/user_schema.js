const Joi = require("joi");


exports.user_data_schema = Joi.object({
    first_name: Joi.string().alphanum().min(3).max(30).required(),
    last_name: Joi.string().alphanum().min(3).max(30).required(),
    email_id: Joi.string().email().required(),
    address1: Joi.string().required(),
    address2: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required()
  });