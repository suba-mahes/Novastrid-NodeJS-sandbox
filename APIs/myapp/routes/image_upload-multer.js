var express = require('express');
const image = require('../controller/image_upload-multer');
const upload = require('../middleware/multer_middleware')

var router = express.Router();

router.get('/view/image/:imageName',image.getImage);
router.post('/image', upload.single('image'), image.insertImage);


module.exports = router;