const fs = require("fs");
const puppeteer = require("puppeteer");
const html_pdf = require("html-pdf");
const pdf_document = require("pdfkit");
const html_to_pdf = require('html-pdfkit');

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
      //     display.end_error_result(res, error);
      //   } else {
      //     display.end_result(res, 200, {
      //       message: "File is uploaded successfully",
      //     });
      //   }
      // });
      //    res.sendFile(file_path);
    } catch (error) {
      display.end_error_result(res, error);
    }
    await browser.close();
  } catch (err) {
    display.end_error_result(res, err);
  }
};

exports.using_html_pdf = async (req, res) => {
  try {
    const html = req.body;

    html_pdf.create(html).toBuffer((err, buffer) => {
      if (err) {
        display.end_error_result(res, error);
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
          //     display.end_error_result(res, error);
          //
          //     });
          //   } else {
          //     display.end_result(res, 200, {
          //       message: "File is uploaded successfully",
          //     });
          //   }
          // });
          //    res.sendFile(file_path);
        } catch (error) {
          display.end_error_result(res, error);
        }
      }
    });
  } catch (err) {
    display.end_error_result(res, err);
  }
};

exports.using_pdfkit = async (req, res) => {
  try {
    
    const html = req.body;
    const filename = `output_pdf_pdfkit_${Date.now()}.pdf`;
    const file_path = path.join(upload_dir, filename);

    const doc = new pdf_document();

    const write_stream = fs.createWriteStream(file_path);
    doc.pipe(write_stream);

    //doc.text(html);

    html_to_pdf(doc, html, {
        width: 600, // Width of the PDF document
        autoFirstPage: false // Do not automatically start a new page
    });
    doc.end();

    write_stream.on('finish', () => {
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=" + filename,
      });
      res.send(file_path);
      //res.download(filePath);
    });

    write_stream.on('error', (err) => {
      display.end_error_result(res, err);
    });

    // doc.pipe(
    //   new (require("stream").Writable)({
    //     write(chunk, encoding, callback) {
    //       buffers.push(chunk);
    //       callback();
    //     },
    //     final(callback) {
    //       res.set({
    //         "Content-Type": "application/pdf",
    //         "Content-Disposition": `attachment; filename=${filename}`,
    //       });
    //       res.send(Buffer.concat(buffers));
    //       fs.writeFileSync(file_path, Buffer.concat(buffers));
    //       callback();
    //     },
    //   })
    // );

    // doc.text(html);
    // doc.end();
  } catch (err) {
    display.end_error_result(res, err);
  }
};
