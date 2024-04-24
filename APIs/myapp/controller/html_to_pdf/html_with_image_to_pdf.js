const axios = require("axios");
const fs = require("fs");
const puppeteer = require("puppeteer");
const html_pdf = require("html-pdf");
const pdf_document = require("pdfkit");
const { Readable } = require("stream");
const cheerio = require("cheerio");

var display = require("../result_display.js");

const path = require("path");

const upload_dir =
  "/node_js/Novastrid-NodeJS-sandbox/APIs/myapp/pdf-download-with_image";

exports.using_puppeteer = async (req, res) => {
  try {
    const html = req.body;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdf_buffer = await page.pdf({ format: "A4" });

    const filename = `output_pdf_puppeteer_${Date.now()}.pdf`;
    const file_path = path.join(upload_dir, filename);
    try {
      fs.writeFile(file_path, pdf_buffer, (err) => {
        if (err) {
          display.end_result(res, err.status || 500, {
            message: err.message || "Some error occurred.",
          });
        } else {
          res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment; filename=" + filename,
          });
          // res.send(pdf_buffer);
          res.download(file_path);
        }
      });
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

    const image_regex = /<img\s+[^>]*src="([^"]+)"[^>]*>/g;
    const matches = html.matchAll(image_regex);
    const promises = [];
    for (const match of matches) {
      const image_url = match[1];
      promises.push(
        axios
          .get(image_url, { responseType: "arraybuffer" })
          .then(
            (response) =>
              `data:image/jpeg;base64,${Buffer.from(response.data).toString(
                "base64"
              )}`
          )
          .catch((error) => {
            console.error(
              `Error fetching image from ${image_url}: ${error.message}`
            );
            return null;
          })
      );
    }
    const encoded_images = await Promise.all(promises);
    let index = 0;
    html.replace(image_regex, () => `src="${encoded_images[index++]}"`);

    html_pdf.create(html).toBuffer((err, buffer) => {
      if (err) {
        display.end_error_result(res, err);
      } else {
        const filename = `output_pdf_html-pdf_${Date.now()}.pdf`;
        const file_path = path.join(upload_dir, filename);
        try {
          fs.writeFile(file_path, buffer, (err) => {
            if (err) {
              display.end_result(res, err.status || 500, {
                message: err.message || "Some error occurred.",
              });
            } else {
              res.set({
                "Content-Type": "application/pdf",
                "Content-Disposition": "attachment; filename=" + filename,
              });
              //res.send(buffer);

              res.download(file_path);
            }
          });
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

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    // Pipe the PDF output to the response stream
    doc.pipe(res);

    // Convert the HTML content to PDF
    doc.text(html);

    // Finalize the PDF document
    doc.end();

    // Handle errors on the PDF document
    doc.on("error", (error) => {
      display.end_error_result(res, error);
      console.error("Error generating PDF:", error);
    });
  }

    // const image_regex = /<img\s+[^>]*src="([^"]+)"[^>]*>/g;
    // const matches = html.matchAll(image_regex);
    // const promises = [];
    // for (const match of matches) {
    //   const image_url = match[1];
    //   promises.push(
    //     axios
    //       .get(image_url, { responseType: "arraybuffer" })
    //       .then(
    //         (response) =>
    //           `data:image/jpeg;base64,${Buffer.from(response.data).toString(
    //             "base64"
    //           )}`
    //       )
    //       .catch((error) => {
    //         return null;
    //       })
    //   );
    // }
    // const encoded_images = await Promise.all(promises);
    // let index = 0;
    // const embeddedHtml = html.replace(
    //   image_regex,
    //   () => `src="${encoded_images[index++]}"`
    // );

    //   const writeStream = fs.createWriteStream(outputPath);
    //   doc.pipe(writeStream);

    //   // Handle errors on the write stream
    //   writeStream.on('error', (error) => {
    //     display.end_error_result(res, error);
    //     console.error('Error writing PDF:', error);
    //     doc.destroy(); // Cleanup the PDF document
    // });

    // // Pipe the HTML stream to the PDF document
    // htmlStream.pipe(doc);

    //   writeStream.on("finish", () => {
    //     res.set({
    //       "Content-Type": "application/pdf",
    //       "Content-Disposition": "attachment; filename=" + filename,
    //     });
    //     res.download(file_path);
    //   });
  } catch (err) {
    display.end_error_result(res, err);
  }
};
