const fs = require("fs");
const puppeteer = require("puppeteer");
const html_pdf = require("html-pdf");
const pdf_document = require("pdfkit");

var display = require("../result_display.js");

const path = require("path");

const uploadDir = "/node_js/Novastrid-NodeJS-sandbox/APIs/myapp/pdf-download";

exports.using_puppeteer = async (req, res) => {
  try {
    const html = req.body;
    console.log(html);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    const pdf_buffer = await page.pdf({ format: "A4" });
    console.log(pdf_buffer);
    const filename = `output_pdf_puppeteer_${Date.now()}.pdf`;
    const file_path = path.join(uploadDir, filename);
    try {
      fs.writeFile(file_path, pdf_buffer);
      //    res.sendFile(file_path);

      //   res.set({
      //     'Content-Type': 'application/pdf',
      //     "Content-Disposition": 'attachment; filename='+ filename,
      // });
      // res.send(pdf_buffer);

      display.end_result(res, 200, { message: "File is uploaded sucessfully" });
    } catch (error) {
      display.end_result(res, error.status || 500, {
        message: error.message || "Some error occurred.",
      });
    }
    await browser.close();
  } catch (err) {
    display.end_result(res, err.status || 500, {
      message: err.message || "Some error occurred.",
    });
  }
};

exports.using_html_pdf = async (req, res) => {
  try {
    const html = req.body;

    html_pdf.create(html).toBuffer((err, buffer) => {
      if (err) {
        display.end_result(res, error.status || 500, {
          message: err || "Some error occurred.",
        });
      } else {
        const filename = `output_pdf_html-pdf_${Date.now()}.pdf`;
        const file_path = path.join(uploadDir, filename);
        try {
          fs.writeFile(file_path, buffer);
          //    res.sendFile(file_path);

          display.end_result(res, 200, {
            message: "File is uploaded sucessfully",
          });
        } catch (error) {
          display.end_result(res, error.status || 500, {
            message: error.message || "Some error occurred.",
          });
        }

        // res.set({
        //     'Content-Type': 'application/pdf',
        //     "Content-Disposition": 'attachment; filename='+ filename,
        // });
        // res.send(buffer);
      }
    });
  } catch (err) {
    display.end_result(res, err.status || 500, {
      message: err.message || "Some error occurred.",
    });
  }
};

exports.using_pdfkit = async (req, res) => {
  try {
    const html = req.body;

    const filename = `output_pdf_pdfkit_${Date.now()}.pdf`;
    const file_path = path.join(uploadDir, filename);

    const doc = new pdf_document();
    const buffers = [];
    doc.pipe(
      new (require("stream").Writable)({
        write(chunk, encoding, callback) {
          buffers.push(chunk);
          callback();
        },
        final(callback) {
          res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment; filename=" + filename,
          });
          res.end(Buffer.concat(buffers));
          callback();
        },
      })
    );

    doc.text(html);
    doc.end();
  } catch (err) {
    display.end_result(res, err.status || 500, {
      message: err.message || "Some error occurred.",
    });
  }
};
