const db = require("../model");
const actor = db.actor;
const movie = db.movie;
const actor_movie = db.actor_movie;

const sequelize = db.Sequelize;
const op = sequelize.Op;

const validation = require("../validation/validation_movie");
var display = require("./result_display.js");

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
      display.end_result(res,200,data);  
    }
    else{
      display.end_result(res,200,{'movie': data, 'message': 'table is empty'});
      return;
    }
  }
  catch(err){
    display.end_result(res,err.status || 500,{"message": err.message || "Some error occurred while retrieving movies."})
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
      display.end_result(res,200,data);  
      return;
    }
    else{
        display.end_result(res,404,{"message":'movie is not found'});  
        return;
    }
  }
  catch(err){
    display.end_result(res,err.status || 500,{"message": err.message || "Some error occurred while retrieving movies."})
  }
};

exports.create = async(req, res) => {
  try{
    // Create a actor
    const movie_data = req.body;

    const actor_data = req.body.actors;
    
    // Save actor in the database
    const data = await movie.create({
      ...movie_data,
      actor:[{...actor_data}]
    },
    {
      include: actor
    });

    if(data){
      display.end_result(res,200,data);
    }
    else{
      display.end_result(res,404,{"message":"insertion failed at movie table"});
    }
  }
  catch(err){
    display.end_result(res,err.status  || 500,{"message": err.message || "Some error occurred while creating the movie."})
  }
};

exports.create_with_actor_id = async(req, res) => {
  try{
    // Create a actor
    const movie_data = req.body;

    const actor_data = req.body.actor_id;

    const {count, rows} = await actor.findAndCountAll({
      where : {
        actor_id: {[op.in]: actor_data}
      }
    });

    if(count === actor_data.length){

      const data = await movie.create({
        ...movie_data
      });
      
      await data.addActors(rows);

      if(data){
        display.end_result(res,200,data);
      }
      else{
        display.end_result(res,404,{"message":"insertion failed at movie table"});
      }
    }  
    else{
      display.end_result(res,404,{"message":"invalid actor id"});
    }  
  }
  catch(err){
    display.end_result(res,err.status  || 500,{"message": err.message || "Some error occurred while creating the movie."})
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
        display.end_result(res,200,data);
      }
      else{
          display.end_result(res,400,{"message": "movie not found"});
        }
    }
    else{
        display.end_result(res,400,{"message": "missing the requirements"})
        return;
    }
  }
  catch(err){
    display.end_result(res,err.status  || 500,{"message": err.message || "Some error occurred while updating the movie."})
  }
};

exports.deleteByID = async(req,res) =>{
  try{
    let id = parseInt(req.params.id);
    
    if(!id){
      display.end_result(res,404,{"message":'parameter is empty'});  
      return;
    }

    data = await movie.findByPk(id)
    if(data){
      const ref = await actor_movie.findOne({ where: { movie_id: id } });
      if(ref){
        await ref.destroy();
      }    
      await data.destroy();
      display.end_result(res,200,{"message": "deleted sucessfully"});
      return;
    }
    else{
      display.end_result(res,400,{"message": "movie not found"});
      return
    }
  }
  catch(err){
        display.end_result(res,err.status  || 500,{"message": err.message || "Some error occurred while deleting the movie."})
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