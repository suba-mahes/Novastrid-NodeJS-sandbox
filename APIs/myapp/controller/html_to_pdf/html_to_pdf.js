const fs = require("fs");
const puppeteer = require("puppeteer");
const html_pdf = require("html-pdf");
const pdf_document = require("pdfkit");

var display = require("../result_display.js");

const path = require("path");

const upload_dir = "/node_js/Novastrid-NodeJS-sandbox/APIs/myapp/pdf-download";

exports.using_puppeteer = async (req, res) => {
  try {
    const html = req.body;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    const pdf_buffer = await page.pdf({ format: "A4" });

    const filename = `output_pdf_puppeteer_${Date.now()}.pdf`;
    const file_path = path.join(upload_dir, filename);
    try {
      fs.writeFileSync(file_path, pdf_buffer);
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=" + filename,
      });
      res.send(pdf_buffer);
      //   (err) => {
      //   // Provide a callback function here
      //   if (err) {
      //     display.end_result(res, err.status || 500, {
      //       message: err.message || "Some error occurred.",
      //     });
      //   } else {
      //     display.end_result(res, 200, {
      //       message: "File is uploaded successfully",
      //     });
      //   }
      // });
      //    res.sendFile(file_path);
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
        const file_path = path.join(upload_dir, filename);
        try {
          fs.writeFileSync(file_path, buffer);
          res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment; filename=" + filename,
          });
          res.send(buffer);

          // , (err) => {
          //   // Provide a callback function here
          //   if (err) {
          //     display.end_result(res, err.status || 500, {
          //       message: err.message || "Some error occurred.",
          //     });
          //   } else {
          //     display.end_result(res, 200, {
          //       message: "File is uploaded successfully",
          //     });
          //   }
          // });
          //    res.sendFile(file_path);
        } catch (error) {
          display.end_result(res, error.status || 500, {
            message: error.message || "Some error occurred.",
          });
        }
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
    const file_path = path.join(upload_dir, filename);

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
            "Content-Disposition": `attachment; filename=${filename}`,
          });
          res.send(Buffer.concat(buffers));
          fs.writeFileSync(file_path, Buffer.concat(buffers));
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
