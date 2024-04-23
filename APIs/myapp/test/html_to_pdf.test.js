// test/users.test.js
const db = require("../model/index.js");

const { expect } = require("expect");
const request = require("supertest");
const path = require("path");
const fs = require("fs");

const app = require("../app.js");

const pdf_parse = require("pdf-parse");

const upload_dir = "/node_js/Novastrid-NodeJS-sandbox/APIs/myapp/pdf-download";

before(function (done) {
  db.sequelize
    .sync()
    .then(() => {
      console.log("Sequelize models synced for testing\n");
      console.log(
        "\n\n let's start the whole test for converting html to pdf\n"
      );
      done();
    })
    .catch(done);
});

beforeEach(function (done) {
  console.log("\nlet's start the test : ");
  done();
});

afterEach(function (done) {
  console.log("---let's end the test---\n");
  done();
});

after(function (done) {
  console.log("\nlet's end the whole test for converting html to pdf\n");
  done();
});

describe("To convert html to PDF", function () {
  const html = `
      <html>
        <head><title>Test HTML to PDF</title></head>
        <body>
          <h1>Hello!</h1>
          <p>This is a test HTML content to convert to PDF.</p>
        </body>
      </html>
    `;

  it("should generate html content to pdf using puppeteer on post ", function (done) {
    request(app)
      .post(`/pdf/generate-pdf-using-puppeteer`)
      .send(html)
      .expect(200)
      .end(function (err, res) {
        const header = res.headers["content-disposition"];

        const filename = header.split("=")[1];
        const output_path = path.join(upload_dir, filename);

        expect(fs.existsSync(output_path)).toBe(true);
        const pdf_content = fs.readFileSync(output_path);

        pdf_parse(pdf_content).then((data) => {
          const text_content = data.text;

          console.log(text_content);
          expect(text_content).toContain("Hello!");
          expect(text_content).toContain(
            "This is a test HTML content to convert to PDF."
          );
        });

        fs.unlinkSync(output_path);

        done();
      });
  }).timeout(500000);

  // it("should generate html content to pdf using html-pdf on post ", function (done) {
  //   request(app)
  //     .post(`/pdf/generate-pdf-using-html-pdf`)
  //     .set("Content-Type", "text/html")
  //     .send(html)
  //     .expect(200)
  //     .end(function (err, res) {
  //       const header = res.headers["content-disposition"];

  //       const filename = header.split("=")[1];
  //       const output_path = path.join(upload_dir, filename);

  //       expect(fs.existsSync(output_path)).toBe(true);
  //       const pdf_content = fs.readFileSync(output_path);

  //       pdf_parse(pdf_content).then((data) => {
  //         const text_content = data.text;

  //         console.log(text_content);
  //         expect(text_content).toContain("Hello!");
  //         expect(text_content).toContain(
  //           "This is a test HTML content to convert to PDF."
  //         );
  //       });

  //       fs.unlinkSync(output_path);

  //       done();
  //     });
  // }).timeout(500000);

  // it("should generate html content to pdf using pdfkit on post ", function (done) {
  //   request(app)
  //     .post(`/pdf/generate-pdf-using-pdfkit`)
  //     .set("Content-Type", "text/html")
  //     .send(html)
  //     .expect(200)
  //     .end(function (err, res) {
  //       const header = res.headers["content-disposition"];

  //       const filename = header.split("=")[1];
  //       const output_path = path.join(upload_dir, filename);
  //       console.log(output_path);
  //       //expect(fs.existsSync(output_path)).toBe(true);
  //       const pdf_content = fs.readFileSync(output_path);

  //       pdf_parse(pdf_content).then((data) => {
  //         const text_content = data.text;

  //         console.log(text_content);
  //         // expect(text_content).toContain("Hello!");
  //         // expect(text_content).toContain(
  //         //   "This is a test HTML content to convert to PDF."
  //         // );
  //       });

  //       fs.unlinkSync(output_path);

  //       done();
  //     });
  // }).timeout(500000);
});
