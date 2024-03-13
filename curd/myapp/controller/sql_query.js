var sql_connection = require('../config/connection');

module.exports.getAllUsers = async(req,res)=>{
    
    await sql_connection.query("select u.user_id,u.first_name,u.last_name,u.email_id,u.dof,a.address1,a.address2,a.city, a.state, a.country, a.pin_number from user u join user_address a on u.user_id = a.user_id;", (err,user_results) => {
        if(err){
            EndResult(res,err.status || 500,{"message": err.message})
            return;
        }
        const user = JSON.parse(JSON.stringify(user_results))
        EndResult(res,200,user);  
    })
}

module.exports.getUserByID = async(req,res)=>{

    let id = parseInt(req.params.id);   
    await sql_connection.query("select u.user_id,u.first_name,u.last_name,u.email_id,u.dof,a.address1,a.address2,a.city, a.state, a.country, a.pin_number from user u join user_address a on u.user_id = a.user_id where u.user_id = ?",[id], (err,user_results) => {
        if(err){
            EndResult(res,err.status || 500,{"message": err.message})
            return;
        }
        const user = JSON.parse(JSON.stringify(user_results))
        if(user.length)
        {
            EndResult(res,200,user[0]);  
            return;
        }
        else{
            EndResult(res,404,{"message":'user is not found'});  
            return
        }          
    });
}

module.exports.create = async(req,res)=>{
    const user=req.body;
    
    //if(checkValidation(user)){
        const {first_name, last_name, email_id, dof, address1, address2, city, state, country, pin_number} = user;

        await sql_connection.query("insert into user SET ?",{first_name, last_name, email_id, dof}, (err,user_results) => {
            if(err){
                EndResult(res,err.status || 500,{"message": err.message})
                return;
            }
            const user = JSON.parse(JSON.stringify(user_results))
            if(user.affectedRows){
                    let user_id = user.insertId;
                    sql_connection.query("insert into user_address SET ?",{address1, address2, city, state, country, pin_number,user_id}, (err,user_address_results) => {
                    if(err){
                        EndResult(res,err.status || 500,{"message": err.message});
                        return;
                    }
                    if(user_address_results.affectedRows == 0){
                        EndResult(res,404,{'message':"insertion failed at address"});
                        return;
                    }
                    else{
                        EndResult(res,200,{'message':"inserted successfully"});
                        return;
                    }
                });
            }
        else{
            EndResult(res,404,{'message':"insertion failed"});
            return;
        }  
    });
}

module.exports.deleteUserByID = async(req,res)=>{
    let id = parseInt(req.params.id); 
    console.log(id);  
    await sql_connection.query("delete from user u where u.user_id = ?",[id], (err,user_results) => {
        if(err){
            EndResult(res,err.status || 500,{"message": err.message})
            return;
        }
        if(user_results.affectedRows){
                EndResult(res,200,{"message": "deleted successfully"});
                return;
            }
            else{
                EndResult(res,404,{'message':"user isnot found"});
                return;
            }
        });
}

module.exports.update = async(req,res)=>{
    const user = req.body;
    const id = parseInt(req.params.id);
    //if(checkValidation(user)){
    const {first_name, last_name, email_id, dof, address1, address2, city, state, country, pin_number} = user;

    await sql_connection.query(`update user u join user_address a on u.user_id = a.user_id set u.first_name = ?,  u.last_name = ?, u.email_id = ?, u.dof = ?, a.address1 = ?, a.address2 = ?, a.city= ?, a.state = ?, a.country = ?, a.pin_number = ? where u.user_id = ? And a.user_id = ? `,[first_name, last_name, email_id, dof, address1, address2, city, state, country, pin_number, id, id], (err,results) => {
        if(err){
            EndResult(res,err.status || 500,{"message": err.message})
            return;
        }
        const user_results = JSON.parse(JSON.stringify(results))
        if(user_results.affectedRows){
            EndResult(res,200,{'message':"updated successfully"});
            return;
        }
        else{
            EndResult(res,404,{'message':"updation failed"});
            return;
        }
    });
}




function EndResult(res,res_status,result)
{
    res.format({
      "application/json"(){
        res.status(res_status);
        res.json(result);
      }
    })
} 