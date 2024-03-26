const db = require("../model");
const actor = db.actor;
const movie = db.movie;
const actor_movie = db.actor_movie;


const validation = require("../validation/validation_movie");
const movie_validation = require("../validation/joi/validation");

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
    //if(validation.validation_create_movie(req.body)){
    const { error, value } = movie_validation.validation_movie(req.body);
    
    if(error){
        EndResult(res,500,{"message": error.details.map(detail => detail.message)});
        return;
    }
    else{
      // Create a actor
      const movie_data = req.body;

      const actor_data = req.body.actors;
      
      // Save actor in the database
      const data = await movie.create({
        ...movie_data,
        actor:[{...actor_data}],
        actor_movie: actor_data.map(value => ({
          actor_id: value.actor_id, 
          movie_id: movie_data.movie_id
        }))
      },
      {
        include: actor
      });

      if(data){
        EndResult(res,200,data);
      }
      else{
        EndResult(res,404,{"message":"insertion failed at movie table"});
      }
    }
    // else{
    //   EndResult(res,400,{"message": "missing the requirements"})
    //   return;
    // }
  }
  catch(err){
    EndResult(res,err.status  || 500,{"message": err.message || "Some error occurred while creating the movie."})
  }
};

exports.update = async(req,res) =>{
  try{
    let id = parseInt(req.params.id);

    if(validation.validation_movie(req.body)){
      const data = await movie.findByPk(id)
      if(data)
      {
        await data.update(req.body);
        EndResult(res,200,data);
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