var express = require('express');
const image = require('../controller/image_upload');

var router = express.Router();

router.get('/view/image/:imageName',image.getImage);
router.post('/image',image.insertImage);


module.exports = router;