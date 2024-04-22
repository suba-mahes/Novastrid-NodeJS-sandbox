var express = require("express");
const image = require("../../controller/image_upload/image_upload");
const upload = require("../../middleware/image_upload/multer_middleware");

var router = express.Router();

router.get("/view/image/:imageName", image.getImage);
router.post("/image", upload.single("image"), image.insertImage);

module.exports = router;
