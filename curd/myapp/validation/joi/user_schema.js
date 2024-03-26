const Joi = require("joi");


exports.user_data_schema = Joi.object({
    first_name: Joi.string().alphanum().min(3).max(30).required().messages({
      "any.required" : "first_name is required",
      "string.empty" : "first name cannot be empty",
      "string.min" : "first name should have atleast 3 minimum characters",
      "string.max" : "first name should have only 3o maximum characters",
      "string.alphanum" : "first name should be alpha numeric",
    }),
    last_name: Joi.string().alphanum().min(3).max(30).required().messages({
      "any.required" : "last_name is required",
      "string.empty" : "last name cannot be empty",
      "string.min" : "last name should have atleast 3 minimum characters",
      "string.max" : "last name should have only 3o maximum characters",
      "string.alphanum" : "last name should be alpha numeric",
    }),
    email_id: Joi.string().email().required().messages({
      "any.required" : "email is required",
      "string.empty" : "email cannot be empty",
      "string.email" : "some thing is missing in email format",
    }),
    address1: Joi.string().required().messages({
      "any.required" : "address is required",
      "string.empty" : "address cannot be empty",
    }),
    address2: Joi.string().required().messages({
      "any.required" : "address is required",
      "string.empty" : "address cannot be empty",
    }),
    city: Joi.string().required().messages({
      "any.required" : "city is required",
      "string.empty" : "city cannot be empty",
    }),
    state: Joi.string().required().messages({
      "any.required" : "state is required",
      "string.empty" : "state cannot be empty",
    }),
    country: Joi.string().required().messages({
      "any.required" : "country is required",
      "string.empty" : "country cannot be empty",
    })
  });