const Joi = require("joi");


exports.user_details_data_schema = Joi.object({
    first_name: Joi.string().alphanum().min(3).max(30).required(),
    last_name: Joi.string().alphanum().min(3).max(30).required(),
    email_id: Joi.string().email().required(),
    address: {
      address1: Joi.string().required(),
      address2: Joi.string().required(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      country: Joi.string().optional()
    }
  });