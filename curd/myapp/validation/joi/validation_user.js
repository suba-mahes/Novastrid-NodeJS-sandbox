var user_schema = require("./user_schema.js")
var user_detail_schema = require("./user_detail_schema.js")
var user_detail_table_schema = require("./user_detail_table_schema.js")


module.exports.validation_user = (data)=>{
    return user_schema.user_data_schema.validate(data);
}

module.exports.validation_user_detail = (data)=>{
    return user_detail_schema.user_details_data_schema.validate(data);
}

module.exports.validation_user_detail_table = (data)=>{
    return user_detail_table_schema.user_details_data_schema.validate(data);
}