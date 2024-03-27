const db = require("../model");
const user = db.user;
const user_address = db.user_address;

const validation = require("../validation/user_validation");
const user_validation = require("../middleware/validation_user.js");
var display = require("./result_display.js");

exports.findAll = async(req,res) => {
  try{
    const data = await user.findAll({include: user_address});
    if(data){
      display.end_result(res,200,data);  
    }
    else{
      display.end_result(res,200,{'user': data, 'message': 'table is empty'});
      return;
    }
  }
  catch(err){
    display.end_result(res,err.status || 500,{"message": err.message || "Some error occurred while retrieving users."})
    return;
  }
};

exports.findID = async(req,res) => {
  try{
    let id = parseInt(req.params.id); 

    if(!id){
      display.end_result(res,404,{"message":'parameter is empty'});  
      return;
    }

    const data = await user.findOne({
      where: {
        user_id : id,
      },
      include : user_address
    })
    if(data){
      display.end_result(res,200,data);  
      return;
    }
    else{
        display.end_result(res,404,{"message":'user is not found'});  
        return;
    }
  }
  catch(err){
    display.end_result(res,err.status || 500,{"message": err.message || "Some error occurred while retrieving users."})
  }
};

exports.create = async(req, res) => {
  try{
    // Create a user
    const user_data = req.body
    user_data.createdAt = new Date().toJSON().slice(0, 10);
    user_data.updatedAt = new Date().toJSON().slice(0, 10);

    const user_adress_data = req.body.address;
    user_adress_data.createdAt= new Date().toJSON().slice(0, 10);
    user_adress_data.updatedAt= new Date().toJSON().slice(0, 10);
    
    // Save user in the database
    const data = await user.create({
      ...user_data,
      //user_address:{...user_adress_data,user_id:user_data.user_id}
      user_address: user_adress_data
    },
    {
      include: [user_address]
    });
    if(data){
        display.end_result(res,200,data);
      }
      else{
        display.end_result(res,404,{"message":"insertion failed at address table"});
      }
  }
  catch(err){
    display.end_result(res,err.status  || 500,{"message": err.message || "Some error occurred while creating the user."})
  }
};

exports.update = async(req,res) =>{
  try{
    let id = parseInt(req.params.id);

    if(validation.validation_user(req.body)){
      req.body.updatedAt = new Date().toJSON().slice(0, 10);
      const data = await user.findByPk(id)
      if(data)
      {
        await data.update(req.body);
        const address = await user_address.findOne({ where: { user_id: id } });
        req.body.address.updatedAt = new Date().toJSON().slice(0, 10);
        if(address){
          await address.update(req.body.address);
          data.dataValues.address = address;
          display.end_result(res,200,{"message": "Updated sucessfully","updated_user":data});
          return;
        }
        else{
          display.end_result(res,400,{"message": "user address not found"});
        }
      }
    else{
        display.end_result(res,400,{"message": "user not found"});
      }
    }
    else{
        display.end_result(res,400,{"message": "missing the requirements"})
        return;
    }
  }
  catch(err){
    display.end_result(res,err.status  || 500,{"message": err.message || "Some error occurred while updating the user."})
  }
};

exports.deleteByID = async(req,res) =>{
  try{
    let id = parseInt(req.params.id);
    
    if(!id){
      display.end_result(res,404,{"message":'parameter is empty'});  
      return;
    }

    data = await user.findByPk(id)
    if(data){
      const address = await user_address.findOne({ where: { user_id: id } });
      if(address){
        await address.destroy();
      }    
      await data.destroy();
      display.end_result(res,200,{"message": "deleted sucessfully"});
      return;
    }
    else{
      display.end_result(res,400,{"message": "user not found"});
      return
    }
  }
  catch(err){
        display.end_result(res,err.status  || 500,{"message": err.message || "Some error occurred while deleting the user."})
  }
};


// function EndResult(res,res_status,result)
// {
//     res.format({
//       "application/json"(){
//         res.status(res_status);
//         res.json(result);
//       }
//     })
// } 