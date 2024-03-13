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


function EndResult(res,res_status,result)
{
    res.format({
      "application/json"(){
        res.status(res_status);
        res.json(result);
      }
    })
} 