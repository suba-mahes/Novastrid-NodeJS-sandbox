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
        EndResult(res,err.status  || 500,{"message": err.message || "Some error occurred while retrieving tutorials."})
        return;
    });
};

exports.create = (req, res) => {
    // Validate request
    if (!req.body.first_name && !req.body.last_name && !req.body.email_id && !req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
  
    // Create a user
    const user_data = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email_id: req.body.email_id,
    };
  
    // Save user in the database
    user.create(user_data)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the user."
        });
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