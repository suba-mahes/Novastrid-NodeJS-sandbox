var sql_connection = require('../../model/connection_db.js');
var display = require("../../controller/result_display.js");


module.exports.login_with_sql = async(req,res) =>{
    try{
        const {email_id, password} = req.body;
    }
    catch(error){
        display.end_result(res,500,{"message": error.message});
    }
}