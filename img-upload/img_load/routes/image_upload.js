const express = require('express');
const path = require('path');
const fs = require('fs');

var router = express.Router();


//const uploadDir = '/node_js/Novastrid-NodeJS-sandbox/img-upload/img_load/file_images';
const uploadDir = '../img_load/file_images';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/view/image/:imageName', (req,res) => {
  try{
    const file_name = req.params.imageName;
    console.log(file_name)
    res.sendFile(file_name,{root:'file_images'});
  }
  catch(err){
    EndResult(res,err.status || 500,{"message": err.message || "Some error occurred."});
  }
});

router.post('/image', (req,res)=>{
  try{
    if (!req.files || Object.keys(req.files).length === 0) {
      EndResult(res,400,{ error: 'No files were uploaded' });
      return;
    }

    const image = req.files.image;

    image.mv(path.join(uploadDir, image.name), (err) => {
      if (err) {
        console.error('Error saving image:', err);
        EndResult(res,400,{ error: 'No files were uploaded' });
        return;
      }
    })
    EndResult(res,200,{ message: 'Image uploaded successfully', imageUrl: '/uploads/' + image.name });
  }
  catch(err){
    EndResult(res,err.status || 500,{"message": err.message || "Some error occurred."});
  }
});

module.exports = router;

function EndResult(res,res_status,result)
{
    res.format({
      "application/json"(){
        res.status(res_status);
        res.json(result);
      }
    })
} 