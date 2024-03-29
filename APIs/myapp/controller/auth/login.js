const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

var sql_connection = require('../../model/connection_db.js');
var display = require("../../controller/result_display.js");
var secret_key = require("../../config/config.js");


module.exports.login_with_sql = async(req,res) =>{
    try{
        const {email_id, password} = req.body;
        try{
            const [auth_results,auth_feilds] = await sql_connection.query("select * from auths a where a.email_id = ?",[email_id]);
            
            if(auth_results.length){
                const passwordMatch = await bcrypt.compare(password, auth_results[0].password);
                
                if (!passwordMatch) {
                    display.end_result(res,401,{"message":'Invalid password'});  
                    return;
                }
                
                const token = jwt.sign({ auth_id: auth_results[0].auth_id,email_id:email_id }, secret_key, { expiresIn: '1h' });
                
                display.end_result(res,200,{'message':"logged in successfully" ,'token':token});
            }
            else{
                display.end_result(res,404,{"message":'user is not found'});  
                return
            }
        }
        catch(err){
            display.end_result(res,err.status || 500,{"message": err.message})
            return;
        }
    }
    catch(error){
        display.end_result(res,500,{"message": error.message});
    }
}