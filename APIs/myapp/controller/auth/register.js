const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

var sql_connection = require('../../model/connection_db.js');
var display = require("../../controller/result_display.js");
var secretKey = require("../../config/config.js");

module.exports.register_with_sql = async(req,res) =>{
    try{
        const {name, email_id, password} = req.body;
        const hashed_password = await bcrypt.hash(password,10);
        try{
            const [results] = await sql_connection.query("insert into auths (name, email_id, password) values(?,?,?) ",[name, email_id, hashed_password]);
            if(results.affectedRows){
                const token = jwt.sign({ auth_id: results.insertId,email_id:email_id }, secretKey, { expiresIn: '1h' });
                display.end_result(res,200,{'message':"registered successfully" , 'token':token});
            }
            else{
                display.end_result(res,404,{'message':"registeration failed"});
                return;
            }
        }
        catch(err){
            display.end_result(res,500,{"message": err.message})
            return;
        }
    }
    catch(error){
        display.end_result(res,500,{"message": error.message})
    }
};