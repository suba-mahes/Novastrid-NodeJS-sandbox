const db = require("../model");
const actor = db.actor;
const movie = db.movie;
const actor_movie = db.actor_movie;


const validation = require("../validation/validation_actor");

exports.findAll = async(req,res) => {
  try{
    
    const data = await actor.findAll({
      include: [{
        model:movie,
        through: {
          attributes: [],
        }
      }] 
    });


    if(data){
      EndResult(res,200,data);  
    }
    else{
      EndResult(res,200,{'actor': data, 'message': 'table is empty'});
      return;
    }
  }
  catch(err){
    EndResult(res,err.status || 500,{"message": err.message || "Some error occurred while retrieving actors."})
    return;
  }
};

exports.findID = async(req,res) => {
  try{
    let id = parseInt(req.params.id); 

    const data = await actor.findOne({
      where: {
        actor_id : id,
      },
      include :[{
        model: movie,
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
        EndResult(res,404,{"message":'actor is not found'});  
        return;
    }
  }
  catch(err){
    EndResult(res,err.status || 500,{"message": err.message || "Some error occurred while retrieving actors."})
  }
};

exports.create = async(req, res) => {
  try{
    // Validate request
    if(validation.validation_create_actor(req.body)){
    
      // Create a actor
      const actor_data = {
        first_name: req.body.first_name,
        last_name: req.body.last_name
      };

      const movie_data = req.body.movies;
      
      // Save actor in the database
      const data = await actor.create(actor_data);
      if(data){
        data.dataValues.movie = [];
        for(const movie_val of movie_data){
          const result = await movie.create(movie_val);
          if(result){
            await actor_movie.create({ movie_id:result.movie_id, actor_id: data.actor_id })
            data.dataValues.movie.push(result);
            console.log(data);
          }
          else{
            EndResult(res,404,{"message":"insertion failed at movie table"});
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
    EndResult(res,err.status  || 500,{"message": err.message || "Some error occurred while creating the actor."})
  }
};

exports.update = async(req,res) =>{
  try{
    let id = parseInt(req.params.id);

    if(validation.validation_actor(req.body)){
      const data = await actor.findByPk(id)
      if(data)
      {
        await data.update(req.body);
        EndResult(res,200,data);
      }
      else{
          EndResult(res,400,{"message": "actor not found"});
        }
    }
    else{
        EndResult(res,400,{"message": "missing the requirements"})
        return;
    }
  }
  catch(err){
    EndResult(res,err.status  || 500,{"message": err.message || "Some error occurred while updating the actor."})
  }
};

exports.deleteByID = async(req,res) =>{
  try{
    let id = parseInt(req.params.id);
    data = await actor.findByPk(id)
    if(data){
      const ref = await db.actor_movie.findOne({ where: { actor_id: id } });
      if(ref){
        await ref.destroy();
      }    
      await data.destroy();
      EndResult(res,200,{"message": "deleted sucessfully"});
      return;
    }
    else{
      EndResult(res,400,{"message": "actor not found"});
      return
    }
  }
  catch(err){
        EndResult(res,err.status  || 500,{"message": err.message || "Some error occurred while deleting the actor."})
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