var user_detail = require("../validation/validation_user.js")
var user_detail_table = require('../validation/validation_user_table.js')
var display = require("../controller/result_display.js");


module.exports.validation_user_detail = (req, res, next)=>{
    if(user_detail.validation_user){
        next();
        return;
    }
    display.end_result(res,500,{"message": "requirement missing"});
}

module.exports.validation_user_detail_table = (req, res, next)=>{
    if(user_detail_table.validation_user){
        next();
        return;
    }
    else{
        display.end_result(res,500,{"message": "requirement missing"});
        return;
    }
}