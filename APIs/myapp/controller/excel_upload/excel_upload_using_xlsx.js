const xlsx = require("xlsx");
var display = require("../result_display.js");

const path = require("path");

const upload_dir =
  "/node_js/Novastrid-NodeJS-sandbox/APIs/myapp/excel-download";

exports.uploadExcel = async (req, res) => {
  try {
    const data = req.body;
    const workbook = xlsx.utils.book_new();

    for (sheet_name of Object.keys(data)) {
      const worksheet = xlsx.utils.json_to_sheet(data[sheet_name]);
      xlsx.utils.book_append_sheet(workbook, worksheet, sheet_name);
    }

    // res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    // res.setHeader('Content-Disposition', 'attachment; filename="output.xlsx"');

    // await workbook.xlsx.write(res)

    const filename = `output_xlsx_${Date.now()}.xlsx`;
    const filepath = path.join(upload_dir, filename);
    console.log(filepath);
    try {
      await xlsx.writeFile(workbook, filepath);
      display.end_result(res, 200, { message: "File is uploaded sucessfully" });
    } catch (error) {
      display.end_result(res, error.status || 500, {
        message: error.message || "Some error occurred.",
      });
    }
  } catch (err) {
    display.end_result(res, err.status || 500, {
      message: err.message || "Some error occurred.",
    });
  }
};

exports.retriveExcel = async (req, res) => {
  try {
    if (!req.file) {
      display.end_result(res, error.status || 400, {
        message: "file has to be uploaded.",
      });
      return;
    }
    try {
      const result = {};
      const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
      for (sheets of workbook.SheetNames) {
        const worksheet = workbook.Sheets[sheets];
        const data = xlsx.utils.sheet_to_json(worksheet);
        result[sheets] = data;
      }
      display.end_result(res, 200, result);
    } catch (error) {
      display.end_result(res, error.status || 500, {
        message: error.message || "Some error occurred.",
      });
    }
  } catch (err) {
    display.end_result(res, err.status || 500, {
      message: err.message || "Some error occurred.",
    });
  }
};

exports.retriveExcelWithoutMulter = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      display.end_result(res, error.status || 400, {
        message: "file has to be uploaded.",
      });
      return;
    }

    const excel_file = req.files.excel_file;
    try {
      const result = {};
      const workbook = xlsx.read(excel_file.data, { type: "buffer" });
      for (sheets of workbook.SheetNames) {
        const worksheet = workbook.Sheets[sheets];
        const data = xlsx.utils.sheet_to_json(worksheet);
        result[sheets] = data;
      }
      display.end_result(res, 200, result);
    } catch (error) {
      display.end_result(res, error.status || 500, {
        message: error.message || "Some error occurred.",
      });
    }
  } catch (err) {
    display.end_result(res, err.status || 500, {
      message: err.message || "Some error occurred.",
    });
  }
};
