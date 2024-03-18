const db = require("../model");
const user = db.user;
const user_address = db.user_address;

const validation = require("../validation/user_validation");

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
    EndResult(res,err.status || 500,{"message": err.message || "Some error occurred while retrieving tutorials."})
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
    EndResult(res,err.status || 500,{"message": err.message || "Some error occurred while retrieving tutorials."})
  }
};

exports.create = async(req, res) => {
  try{
    // Validate request
    if(validation.validation_create_user(req.body)){
    
      // Create a user
      const user_data = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email_id: req.body.email_id
      };

      const user_adress_data = req.body.address;
      
      // const user_adress_data = {
      //   address1: req.body.address.address1,
      //   address1: req.body.address.address1,
      //   address2: req.body.address.address2,
      //   city: req.body.address.city,
      //   state: req.body.address.state,
      //   country: req.body.address.country
      // };
      
      // Save user in the database
      const data = await user.create(user_data);
      if(data){
        data.dataValues.address = [];
        for(const user_address_val of user_adress_data){
          user_address_val.user_id = data.user_id;
          const result = await user_address.create(user_address_val);
          if(result){
            data.dataValues.address.push(result);
            console.log(data);
          }
          else{
            EndResult(res,404,{"message":"insertion failed at address table"});
            return;
          }
        }
        EndResult(res,200,data);
      }
      else{
        EndResult(res,404,{"message":"insertion failed at user table"});
      }
    }
    else{
      EndResult(res,400,{"message": "missing the requirements"})
      return;
    }
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