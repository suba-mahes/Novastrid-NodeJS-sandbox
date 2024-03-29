const Joi = require("joi");


exports.login_schema = Joi.object({
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