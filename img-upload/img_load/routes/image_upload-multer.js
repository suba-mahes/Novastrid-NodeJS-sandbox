const express = require('express');
const multer = require('multer')

var router = express.Router();

const app = express(); 



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../img_load/file_images/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/view/image/:imageName', (req,res) => {
  try{
    const file_name = req.params.imageName;
    res.sendFile(file_name,{root:'file_images'});
  }
  catch(err){
    EndResult(res,err.status || 500,{"message": err.message || "Some error occurred."});
  }
});

router.post('/image', upload.single('image'), (req, res) => {
  try{
    if (req.file) {
      EndResult(res,200,{ message: 'Image uploaded successfully'});
      return;
    }
    else{
      EndResult(res,400,{ error: 'No files were uploaded' });
    }
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