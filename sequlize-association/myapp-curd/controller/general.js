const db = require("../model");
const actor = db.actor;
const movie = db.movie;
const actor_movie = db.actor_movie;

const validation = require("../validation/validation_actor_movie");

exports.findAllActor = async(req,res) => {
  try{
    
    const data = await actor.findAll();
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

exports.findIDActor = async(req,res) => {
  try{
    let id = parseInt(req.params.id); 

    const data = await actor.findOne({
      where: {
        actor_id : id,
      }
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

exports.findAllMovie = async(req,res) => {
  try{
    
    const data = await movie.findAll();
    if(data){
      EndResult(res,200,data);  
    }
    else{
      EndResult(res,200,{'movie': data, 'message': 'table is empty'});
      return;
    }
  }
  catch(err){
    EndResult(res,err.status || 500,{"message": err.message || "Some error occurred while retrieving movie."})
    return;
  }
};

exports.findIDMovie = async(req,res) => {
  try{
    let id = parseInt(req.params.id); 

    const data = await movie.findOne({
      where: {
        movie_id : id,
      }
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
    EndResult(res,err.status || 500,{"message": err.message || "Some error occurred while retrieving movie."})
  }
};


exports.create = async(req, res) => {
  try{
    // Validate request
    if(validation.validation_create(req.body)){
      data = await actor_movie.create(req.body);
      if(data){
        EndResult(res,404,{"message":"inserted successfully"});
      }
      else{
        EndResult(res,404,{"message":"insertion failed"});
        return;
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

    if(validation.validation_update(req.body)){

      const data = await actor_movie.findByPk(id);

      if(data)
      {
        await data.update(req.body);
        EndResult(res,200,data);
      }
      else{
          EndResult(res,400,{"message": "data not found"});
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

// exports.updateMovie = async(req,res) =>{
//   try{
//     let actor_id = parseInt(req.params.actor_id);

//     if(validation.validation_update(req.body)){
      
//       const data = await actor_movie.findOne({
//         where:{
//           actor_id: actor_id
//         }
//       });
      
//       if(data)
//       {
//         await data.update(req.body);
//         EndResult(res,200,data);
//       }
//       else{
//           EndResult(res,400,{"message": "data not found"});
//         }
//     }
//     else{
//         EndResult(res,400,{"message": "missing the requirements"})
//         return;
//     }
//   }
//   catch(err){
//     EndResult(res,err.status  || 500,{"message": err.message || "Some error occurred while updating the actor."})
//   }
// };

exports.deleteByID = async(req,res) =>{
  try{
    let id = parseInt(req.params.id);
    data = await actor_movie.findByPk(id)
    if(data){    
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