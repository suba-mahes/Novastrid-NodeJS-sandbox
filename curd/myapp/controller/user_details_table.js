const db = require("../model");
const user = db.user_table;
const user_address = db.user_address_table;

const validation = require("../validation/user_table_validation");
const user_validation = require("../validation/joi/validation_user");

exports.findAll = async(req,res) => {
  try{
    const data = await user.findAll({include: user_address});
    if(data){
      EndResult(res,200,data);  
    }
    else{
      EndResult(res,200,{'user': data, 'message': 'table is empty'});
      return;
    }
  }
  catch(err){
    EndResult(res,err.status || 500,{"message": err.message || "Some error occurred while retrieving users."})
    return;
  }
};

exports.findID = async(req,res) => {
  try{
    let id = parseInt(req.params.id); 

    const data = await user.findOne({
      where: {
        user_id : id,
      },
      include : user_address
    })
    if(data){
      EndResult(res,200,data);  
      return;
    }
    else{
        EndResult(res,404,{"message":'user is not found'});  
        return;
    }
  }
  catch(err){
    EndResult(res,err.status || 500,{"message": err.message || "Some error occurred while retrieving users."})
  }
};

exports.create = async(req, res) => {
  try{
    // Validate request
    //if(validation.validation_create_user(req.body)){
    const { error, value } = user_validation.validation_user_detail_table(req.body);
      
    if(error){
        EndResult(res,500,{"message": error.details.map(detail => detail.message)});
        return;
    }
    else{

      const user_data = req.body;
      const user_adress_data = req.body.address;

      const data = await user.create({
        ...user_data,
        user_address_tables: user_adress_data.map(address => ({
          ...address,
          user_id: user_data.user_id
        }))
      },
      {
        include: user_address
      });
      if(data){
          EndResult(res,200,data);
        }
        else{
          EndResult(res,404,{"message":"insertion failed at address table"});
        }
    }
    // else{
    //   EndResult(res,400,{"message": "missing the requirements"})
    //   return;
    // }
  }
  catch(err){
    EndResult(res,err.status  || 500,{"message": err.message || "Some error occurred while creating the user."})
  }
};

exports.update = async(req,res) =>{
  try{
    let id = parseInt(req.params.id);

    if(validation.validation_user(req.body)){
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
            EndResult(res,400,{"message": "user address not found"});
            return
          }
        }
        const result = await user.findByPk(id,{ include: user_address });
        EndResult(res,200,result);
      }
    else{
        EndResult(res,400,{"message": "user not found"});
      }
    }
    else{
        EndResult(res,400,{"message": "missing the requirements"})
        return;
    }
  }
  catch(err){
    EndResult(res,err.status  || 500,{"message": err.message || "Some error occurred while updating the user."})
  }
};

exports.deleteByID = async(req,res) =>{
  try{
    let id = parseInt(req.params.id);
    data = await user.findByPk(id)
    if(data){
      const address = await user_address.findOne({ where: { user_id: id } });
      if(address){
        await address.destroy();
      }    
      await data.destroy();
      EndResult(res,200,{"message": "deleted sucessfully"});
      return;
    }
    else{
      EndResult(res,400,{"message": "user not found"});
      return
    }
  }
  catch(err){
        EndResult(res,err.status  || 500,{"message": err.message || "Some error occurred while deleting the user."})
  }
};

exports.deleteByAddressID = async(req,res) =>{
  try{
    let id = parseInt(req.params.id);
    let user_id = parseInt(req.params.user_id);
      const address = await user_address.findOne({ where: { user_address_id: id } });
      if(address){
        await address.destroy();
      }   
      const result = await user.findByPk(user_id,{ include: user_address });
      EndResult(res,200,{"message": "deleted sucessfully","updated user":result});
      return;
    }
  catch(err){
        EndResult(res,err.status  || 500,{"message": err.message || "Some error occurred while deleting the user."})
  }
};


function EndResult(res,res_status,result)
{
    res.format({
      "application/json"(){
        res.status(res_status);
        res.json(result);
      }
    })
} 