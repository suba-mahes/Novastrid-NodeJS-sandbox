const db = require("../model");
const user = db.user;
const user_address = db.user_address;

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
    if (!req.body.first_name || !req.body.last_name || !req.body.email_id) {
      EndResult(res,400,{"message": "missing the requirements"})
      return;
    }
  
    // Create a user
    const user_data = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email_id: req.body.email_id,
      createdAt: new Date().toJSON().slice(0, 10),
      updatedAt: new Date().toJSON().slice(0, 10)
    };


    // Save user in the database
    const data = await user.create(user_data);
    if(data){
        EndResult(res,200,data);
      }
   }
  catch(err){
    EndResult(res,err.status  || 500,{"message": err.message || "Some error occurred while creating the user."})
  }
};

exports.update = async(req,res) =>{
  try{
    let id = parseInt(req.params.id);

    //const user_data = JSON.parse(JSON.stringify(data))

    if(Object.keys(req.body).length){
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
          EndResult(res,200,{"message": "Updated sucessfully"});
          return;
        }
        else{
          EndResult(res,400,{"message": "Updation failed"});
          return;
        }
      }
      else{
        EndResult(res,400,{"message": "user not found"});
        return;
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
      const num = await user.destroy({
        where :{
          user_id : id,
        },
      })
      
      if(num == 1)
      {
        EndResult(res,200,{"message": "deleted sucessfully"});
        return;
      }
      else{
        EndResult(res,400,{"message": "deletion failed or user not found"});
        return;
      }
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