var login = require("../../validation/joi/auth/login.js")
var register = require('../../validation/joi/auth/register.js')
var display = require("../../controller/result_display.js");


module.exports.login = (req, res, next)=>{
    const { error, value } =  login.login_schema.validate(req.body, { abortEarly: false });
    
    if(error){
        display.end_result(res,500,{"message": error.details.map(detail => detail.message)});
        return;
    }
    next();
}

module.exports.reqister = (req, res, next)=>{
    const { error, value } =  register.register_schema.validate(req.body, { abortEarly: false });
    
    if(error){
        display.end_result(res,500,{"message": error.details.map(detail => detail.message)});
        return;
    }
    next();
}