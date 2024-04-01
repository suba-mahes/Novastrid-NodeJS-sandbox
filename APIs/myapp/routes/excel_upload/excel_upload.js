var express = require('express');
const excel = require('../../controller/excel_upload/excel_upload');

var router = express.Router();

router.post('/excel-data',excel.uploadExcel);


module.exports = router;