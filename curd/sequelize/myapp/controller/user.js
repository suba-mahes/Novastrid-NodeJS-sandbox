const db = require("../model");
const user = db.user;

exports.findAll = (req,res) =>{
    user.findAll()
    .then((data) => {
        EndResult(res,200,data);  
    })
    .catch((err)=> {
        EndResult(res,err.status || 500,{"message": err.message || "Some error occurred while retrieving tutorials."})
        return;
    });
};

exports.findID = (req,res) =>{
    
  let id = parseInt(req.params.id); 


  user.findByPk(id)
  .then((data) => {
      const user_result = JSON.parse(JSON.stringify(data))
      if(user_result){
          EndResult(res,200,user_result);  
          return;
      }
      else{
          EndResult(res,404,{"message":'user is not found'});  
          return;
      }
  })
  .catch((err)=> {
      EndResult(res,err.status  || 500,{"message": err.message || "Some error occurred while retrieving users."})
      return;
  });
};

exports.create = (req, res) => {
    // Validate request
    //console.log(!req.body.first_name);
    if (!req.body.first_name || !req.body.last_name || !req.body.email_id || !Object.key(req.body).length) {
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
    user.create(user_data)
      .then(data => {
        EndResult(res,200,data);
      })
      .catch(err => {
        EndResult(res,err.status  || 500,{"message": err.message || "Some error occurred while creating the user."})
      });
};

exports.update = (req,res) =>{
  let id = parseInt(req.params.id);
  
  if (!Object.key(req.body).length) {
      EndResult(res,400,{"message": "missing the requirements"})
      return;
    }
  
  req.body.updatedAt = new Date().toJSON().slice(0, 10);
  user.findByPk(id)
  .then(data =>{
    if(data){
      user.update(req.body, 
        { where :{
          user_id : id,
        },
      })
      .then(num =>{
        if(num == 1){
          EndResult(res,200,{"message": "Updated sucessfully"});
          return;
        }
        else{
          EndResult(res,400,{"message": "Updation failed"});
          return;
        }
      })
      .catch(err =>{
        EndResult(res,err.status  || 500,{"message": err.message || "Some error occurred while updating the user."})
      })
    }
    else{
      EndResult(res,400,{"message": "user not found"});
      return;
    }
  });
};

exports.deleteByID =(req,res) =>{
  let id = parseInt(req.params.id);
  user.findByPk(id)
  .then(data =>{
    if(data){
      user.destroy({
        where :{
          user_id : id,
        },
      })
      .then(num =>{
        if(num == 1)
        {
          EndResult(res,200,{"message": "deleted sucessfully"});
          return;
        }
        else{
          EndResult(res,400,{"message": "deletion failed or user not found"});
          return;
        }
      })
      .catch(err =>{
        EndResult(res,err.status  || 500,{"message": err.message || "Some error occurred while deleting the user."})
      })
    }
    else{
      EndResult(res,400,{"message": "user not found"});
      return
    }
  });
};

exports.deleteAll =(req,res) =>{
  let id = parseInt(req.params.id);

  user.destroy({
    where :{},
    truncate: false
  })
  .then(num =>{
    if(num != 0)
    {
      EndResult(res,200,{"message": `${num} deleted sucessfully`});
      return;
    }
    else{
      EndResult(res,400,{"message": "deletion failed"});
      return;
    }
  })
  .catch(err =>{
    EndResult(res,err.status  || 500,{"message": err.message || "Some error occurred while deleting the user."})
  });
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