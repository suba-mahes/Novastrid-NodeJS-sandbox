const db = require("../../model/index.js");
const actor = db.actor;
const movie = db.movie;
const actor_movie = db.actor_movie;

const sequelize = db.Sequelize;
const op = sequelize.Op;

const validation = require("../../validation/validation_actor_movie");
var display = require("../../controller/result_display.js");

exports.findAllActor = async (req, res) => {
  try {
    const data = await actor.findAll();
    if (data) {
      display.end_result(res, 200, data);
    } else {
      display.end_result(res, 200, { actor: data, message: "table is empty" });
      return;
    }
  } catch (err) {
    display.end_result(res, err.status || 500, {
      message: err.message || "Some error occurred while retrieving actors.",
    });
    return;
  }
};

exports.findIDActor = async (req, res) => {
  try {
    let id = parseInt(req.params.id);

    if (!id) {
      display.end_result(res, 404, { message: "parameter is empty" });
      return;
    }

    const data = await actor.findOne({
      where: {
        actor_id: id,
      },
    });

    if (data) {
      display.end_result(res, 200, data);
      return;
    } else {
      display.end_result(res, 404, { message: "actor is not found" });
      return;
    }
  } catch (err) {
    display.end_result(res, err.status || 500, {
      message: err.message || "Some error occurred while retrieving actors.",
    });
  }
};

exports.findAllMovie = async (req, res) => {
  try {
    const data = await movie.findAll();
    if (data) {
      display.end_result(res, 200, data);
    } else {
      display.end_result(res, 200, { movie: data, message: "table is empty" });
      return;
    }
  } catch (err) {
    display.end_result(res, err.status || 500, {
      message: err.message || "Some error occurred while retrieving movie.",
    });
    return;
  }
};

exports.findIDMovie = async (req, res) => {
  try {
    let id = parseInt(req.params.id);

    if (!id) {
      display.end_result(res, 404, { message: "parameter is empty" });
      return;
    }

    const data = await movie.findOne({
      where: {
        movie_id: id,
      },
    });

    if (data) {
      display.end_result(res, 200, data);
      return;
    } else {
      display.end_result(res, 404, { message: "movie is not found" });
      return;
    }
  } catch (err) {
    display.end_result(res, err.status || 500, {
      message: err.message || "Some error occurred while retrieving movie.",
    });
  }
};

exports.create = async (req, res) => {
  try {
    const data = await actor_movie.findOne({
      where: {
        [op.and]: [
          { movie_id: req.body.movie_id },
          { actor_id: req.body.actor_id },
        ],
      },
    });
    if (data) {
      display.end_result(res, 400, { message: "the data is already inserted" });
    } else {
      const check_actor = await actor.findByPk(req.body.actor_id);
      const check_movie = await movie.findByPk(req.body.movie_id);

      if (check_actor && check_movie) {
        const result = await actor_movie.create(req.body);
        if (result) {
          display.end_result(res, 404, { message: "inserted successfully" });
        } else {
          display.end_result(res, 404, { message: "insertion failed" });
          return;
        }
      } else {
        display.end_result(res, 400, { message: "Invalid values" });
      }
    }
  } catch (err) {
    display.end_result(res, err.status || 500, {
      message: err.message || "Some error occurred while creating the actor.",
    });
  }
};

// exports.updateActor = async(req,res) =>{
//   try{
//     let movie_id = parseInt(req.params.movie_id);

//     if(validation.validation_update(req.body)){

//       const data = await actor_movie.findOne({
//         where:{
//           movie_id: movie_id
//         }
//       });

//       if(data)
//       {
//         await data.update(req.body);
//         display.end_result(res,200,data);
//       }
//       else{
//           display.end_result(res,400,{"message": "data not found"});
//         }
//     }
//     else{
//         display.end_result(res,400,{"message": "missing the requirements"})
//         return;
//     }
//   }
//   catch(err){
//     display.end_result(res,err.status  || 500,{"message": err.message || "Some error occurred while updating the actor."})
//   }
// };

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
//         display.end_result(res,200,data);
//       }
//       else{
//           display.end_result(res,400,{"message": "data not found"});
//         }
//     }
//     else{
//         display.end_result(res,400,{"message": "missing the requirements"})
//         return;
//     }
//   }
//   catch(err){
//     display.end_result(res,err.status  || 500,{"message": err.message || "Some error occurred while updating the actor."})
//   }
// };

exports.deleteByID = async (req, res) => {
  try {
    let actor_id = parseInt(req.params.actor_id);
    let movie_id = parseInt(req.params.movie_id);

    if (!actor_id) {
      display.end_result(res, 404, { message: "parameter is empty" });
      return;
    }

    if (!movie_id) {
      display.end_result(res, 404, { message: "parameter is empty" });
      return;
    }

    const data = await actor_movie.findOne({
      where: {
        actor_id: actor_id,
        movie_id: movie_id,
      },
    });

    if (data) {
      await data.destroy();
      display.end_result(res, 200, { message: "deleted sucessfully" });
      return;
    } else {
      display.end_result(res, 400, { message: "actor not found" });
      return;
    }
  } catch (err) {
    display.end_result(res, err.status || 500, {
      message: err.message || "Some error occurred while deleting the actor.",
    });
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
