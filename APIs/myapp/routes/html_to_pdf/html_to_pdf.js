var express = require("express");
const generate = require("../../controller/html_to_pdf/html_to_pdf");

var router = express.Router();

router.post("/generate-pdf-using-puppeteer", generate.using_puppeteer);
router.post("/generate-pdf-using-html-pdf", generate.using_html_pdf);
router.post("/generate-pdf-using-pdfkit", generate.using_pdfkit);

module.exports = router;
