const { VideoV1RoomRoomParticipantRoomParticipantSubscribeRuleRules } = require("twilio/lib/rest/video/v1/room/participant/subscribeRules");
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
    if(validation.validation_user(req.body)){
    
      // Create a user
      const user_data = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email_id: req.body.email_id,
        createdAt: new Date().toJSON().slice(0, 10),
        updatedAt: new Date().toJSON().slice(0, 10)
      };

      const user_adress_data = {
        address1: req.body.address.address1,
        address2: req.body.address.address2,
        city: req.body.address.city,
        state: req.body.address.state,
        country: req.body.address.country,
        createdAt: new Date().toJSON().slice(0, 10),
        updatedAt: new Date().toJSON().slice(0, 10)
      };
      
      // Save user in the database
      const data = await user.create(user_data);
      if(data){
        user_adress_data.user_id = data.user_id;
        const result = await user_address.create(user_adress_data);
        if(result){
          data.dataValues.address = result;
          EndResult(res,200,data);
        }
        else{
          EndResult(res,404,{"message":"insertion failed at address table"});
        }
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
      req.body.updatedAt = new Date().toJSON().slice(0, 10);
      const data = await user.findByPk(id)
      if(data)
      {
        const num = await user.update(req.body, 
            { where :{
              user_id : id,
            },
          })
        if(num == 1){
          req.body.address.updatedAt = new Date().toJSON().slice(0, 10);
          const address_num = await user_address.update(req.body.address, 
            { where :{
              user_id : id,
            },
          })
          if(address_num == 1){
            EndResult(res,200,{"message": "Updated sucessfully"});
            return;
          }
          else{
            EndResult(res,400,{"message": "Updation failed at address table"});
          }
        }
        else{
          EndResult(res,400,{"message": "Updation failed at user table"});
        }
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

exports.deleteAll = async (req,res) =>{
  try{
    let id = parseInt(req.params.id);

    const num = await user.destroy({
      where :{},
      truncate: false
    })
    if(num != 0)
    {
      EndResult(res,200,{"message": `${num} deleted sucessfully`});
      return;
    }
    else{
      EndResult(res,400,{"message": "deletion failed"});
      return;
    }
  }
  catch(err){
    EndResult(res,err.status  || 500,{"message": err.message || "Some error occurred while deleting the user."})
  };
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