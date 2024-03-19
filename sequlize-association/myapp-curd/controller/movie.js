const db = require("../model");
const actor = db.actor;
const movie = db.movie;
const actor_movie = db.actor_movie;


const validation = require("../validation/validation");

exports.findAll = async(req,res) => {
  try{
    
    const data = await movie.findAll({
      include: [{
        model:actor,
        through: {
          attributes: [],
        }
      }] 
    });


    if(data){
      EndResult(res,200,data);  
    }
    else{
      EndResult(res,200,{'movie': data, 'message': 'table is empty'});
      return;
    }
  }
  catch(err){
    EndResult(res,err.status || 500,{"message": err.message || "Some error occurred while retrieving movies."})
    return;
  }
};

exports.findID = async(req,res) => {
  try{
    let id = parseInt(req.params.id); 

    const data = await movie.findOne({
      where: {
        movie_id : id,
      },
      include :[{
        model: actor,
        through:{
          attributes: [],
        }
      }]
    })
    
    if(data){
      EndResult(res,200,data);  
      return;
    }
    else{
        EndResult(res,404,{"message":'movie is not found'});  
        return;
    }
  }
  catch(err){
    EndResult(res,err.status || 500,{"message": err.message || "Some error occurred while retrieving movies."})
  }
};

exports.create = async(req, res) => {
  try{
    // Validate request
    if(validation.validation_create_user(req.body)){
    
      // Create a actor
      const user_data = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email_id: req.body.email_id
      };

      const user_adress_data = req.body.address;
      
      // Save actor in the database
      const data = await actor.create(user_data);
      if(data){
        data.dataValues.address = [];
        for(const user_address_val of user_adress_data){
          user_address_val.user_id = data.user_id;
          const result = await movie.create(user_address_val);
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
        EndResult(res,404,{"message":"insertion failed at actor table"});
      }
    }
    else{
      EndResult(res,400,{"message": "missing the requirements"})
      return;
    }
  }
  catch(err){
    EndResult(res,err.status  || 500,{"message": err.message || "Some error occurred while creating the movie."})
  }
};

exports.update = async(req,res) =>{
  try{
    let id = parseInt(req.params.id);

    if(validation.validation_user(req.body)){
      const data = await actor.findByPk(id)
      if(data)
      {
        await data.update(req.body);
        data.dataValues.address = [];
        for(const address_val of req.body.address){
          const address = await movie.findOne({ where: { user_address_id: address_val.user_address_id } });
          if(address){
            await address.update(address_val);
          }
          else{
            EndResult(res,400,{"message": "actor address not found"});
            return
          }
        }
        const result = await actor.findByPk(id,{ include: movie });
        EndResult(res,200,result);
      }
    else{
        EndResult(res,400,{"message": "movie not found"});
      }
    }
    else{
        EndResult(res,400,{"message": "missing the requirements"})
        return;
    }
  }
  catch(err){
    EndResult(res,err.status  || 500,{"message": err.message || "Some error occurred while updating the movie."})
  }
};

exports.deleteByID = async(req,res) =>{
  try{
    let id = parseInt(req.params.id);
    data = await movie.findByPk(id)
    if(data){
      const ref = await actor_movie.findOne({ where: { movie_id: id } });
      if(ref){
        await ref.destroy();
      }    
      await data.destroy();
      EndResult(res,200,{"message": "deleted sucessfully"});
      return;
    }
    else{
      EndResult(res,400,{"message": "movie not found"});
      return
    }
  }
  catch(err){
        EndResult(res,err.status  || 500,{"message": err.message || "Some error occurred while deleting the movie."})
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