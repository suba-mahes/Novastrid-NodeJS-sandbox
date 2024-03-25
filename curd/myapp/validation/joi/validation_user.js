var user_schema = require("./user_schema.js")


module.exports.validation_user = (data)=>{
    return user_schema.user_data_schema.validate(data);
}