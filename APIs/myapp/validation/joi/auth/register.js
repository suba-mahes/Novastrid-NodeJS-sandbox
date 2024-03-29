const Joi = require("joi");


exports.register_schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required().messages({
      "any.required" : "first_name is required",
      "string.empty" : "first name cannot be empty",
      "string.min" : "first name should have atleast 3 minimum characters",
      "string.max" : "first name should have only 3o maximum characters",
      "string.alphanum" : "first name should be alpha numeric",
    }),
    email_id: Joi.string().email().required().messages({
      "any.required" : "email is required",
      "string.empty" : "email cannot be empty",
      "string.email" : "some thing is missing in email format",
    }),
    password: Joi.string().required().messages({
      "any.required" : "address is required",
      "string.empty" : "address cannot be empty",
    })
  });