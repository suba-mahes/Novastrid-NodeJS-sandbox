const db = require("../model");
const user = db.user_table;
const user_address = db.user_address_table;

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
    const user_data = req.body;

    const data = await user.create(user_data,
    {
      include: [user_address]
    });
    console.log(data)
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

    const data = await user.findByPk(id)
    if(data)
    {
      await data.update(req.body);
      data.dataValues.address = [];
      for(const address_val of req.body.address){
        const address = await user_address.findOne({ where: { user_address_id: address_val.user_address_id } });
        if(address){
          await address.update(address_val);
        }
        else{
          display.end_result(res,400,{"message": "user address not found"});
          return
        }
      }
      const result = await user.findByPk(id,{ include: user_address });
      display.end_result(res,200,result);
    }
    else{
      display.end_result(res,400,{"message": "user not found"});
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

exports.deleteByAddressID = async(req,res) =>{
  try{
    let id = parseInt(req.params.id);

    if(!id){
      display.end_result(res,404,{"message":'parameter is empty'});  
      return;
    }

    let user_id = parseInt(req.params.user_id);
      const address = await user_address.findOne({ where: { user_address_id: id } });
      if(address){
        await address.destroy();
      }   
      const result = await user.findByPk(user_id,{ include: user_address });
      display.end_result(res,200,{"message": "deleted sucessfully","updated user":result});
      return;
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