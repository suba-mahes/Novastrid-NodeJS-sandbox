var user_schema = require("../../validation/joi/one_to_many/user_detail_table_schema.js")
var display = require("../../controller/result_display.js");



module.exports.validation_user_detail_table = (req, res, next)=>{
    const { error, value } = user_schema.user_details_data_schema.validate(req.body, { abortEarly: false });

    if(error){
        display.end_result(res,500,{"message": error.details.map(detail => detail.message)});
        return;
    }
    next();

}