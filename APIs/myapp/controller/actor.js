const db = require("../model");

const actor = db.actor;
const movie = db.movie;
const actor_movie = db.actor_movie;

const sequelize = db.Sequelize;
const op = sequelize.Op;


const validation = require("../validation/validation_actor");
var display = require("./result_display.js");

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
      display.end_result(res,200,data);  
    }
    else{
      display.end_result(res,200,{'actor': data, 'message': 'table is empty'});
      return;
    }
  }
  catch(err){
    display.end_result(res,err.status || 500,{"message": err.message || "Some error occurred while retrieving actors."})
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
      display.end_result(res,200,data);  
      return;
    }
    else{
        display.end_result(res,404,{"message":'actor is not found'});  
        return;
    }
  }
  catch(err){
    display.end_result(res,err.status || 500,{"message": err.message || "Some error occurred while retrieving actors."})
  }
};

exports.findByName = async(req,res) => {
  try{
    console.log(req.params.name);
    var name = (req.params.name); 
    console.log(name);

    if(!name){
      display.end_result(res,404,{"message":'parameter is empty'});  
      return;
    }

    const data = await actor.findOne({
      where: {
        first_name : { [op.like]: name},
      },
      include :[{
        model: movie,
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
        display.end_result(res,404,{"message":'actor is not found'});  
        return;
    }
  }
  catch(err){
    display.end_result(res,err.status || 500,{"message": err.message || "Some error occurred while retrieving actors."})
  }
};

exports.create = async(req, res) => {
  try{
    // Create a actor
    const actor_data = req.body;

    const movie_data = req.body.movies;
    
    // Save actor in the database
    const data = await actor.create({
      ...actor_data,
      movie:[{...movie_data}],
      actor_movie: movie_data.map(value => ({
        actor_id: actor_data.actor_id, 
        movie_id: value.movie_id
      }))
    },
    {
      include: movie
    });

    if(data){
      display.end_result(res,200,data);
    }
    else{
      display.end_result(res,404,{"message":"insertion failed at actor table"});
    }
  }
  catch(err){
    display.end_result(res,err.status  || 500,{"message": err.message || "Some error occurred while creating the actor."})
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
        display.end_result(res,200,data);
      }
      else{
          display.end_result(res,400,{"message": "actor not found"});
        }
    }
    else{
        display.end_result(res,400,{"message": "missing the requirements"})
        return;
    }
  }
  catch(err){
    display.end_result(res,err.status  || 500,{"message": err.message || "Some error occurred while updating the actor."})
  }
};

exports.deleteByID = async(req,res) =>{
  try{
    let id = parseInt(req.params.id);

    if(!id){
      display.end_result(res,404,{"message":'parameter is empty'});  
      return;
    }

    const data = await actor.findByPk(id)
    if(data){
      const ref = await db.actor_movie.findOne({ where: { actor_id: id } });
      if(ref){
        await ref.destroy();
      }    
      await data.destroy();
      display.end_result(res,200,{"message": "deleted sucessfully"});
      return;
    }
    else{
      display.end_result(res,400,{"message": "actor not found"});
      return
    }
  }
  catch(err){
        display.end_result(res,err.status  || 500,{"message": err.message || "Some error occurred while deleting the actor."})
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