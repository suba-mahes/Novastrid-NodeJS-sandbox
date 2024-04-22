var express = require("express");
const excel = require("../../controller/excel_upload/excel_upload");
const upload = require("../../middleware/excel_upload/multer_middleware");

var router = express.Router();

router.post("/excel-data", excel.uploadExcel);
router.post(
  "/multer/json-data",
  upload.single("excel_file"),
  excel.retriveExcel
);
router.post("/json-data", excel.retriveExcelWithoutMulter);

module.exports = router;
