const ExcelJS = require("exceljs");
var display = require("../result_display.js");

const path = require("path");

const upload_dir =
  "/node_js/Novastrid-NodeJS-sandbox/APIs/myapp/excel-download";

exports.uploadExcel = async (req, res) => {
  try {
    const data = req.body;

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet("cricket");

    worksheet.columns = [
      { key: "id", header: "S.No" },
      { key: "player_name", header: "Player Name" },
      { key: "team_name", header: "Team Name" },
    ];

    data.forEach((item) => {
      worksheet.addRow(item);
    });

    // res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    // res.setHeader('Content-Disposition', 'attachment; filename="output.xlsx"');

    // await workbook.xlsx.write(res)

    const filename = `output_exceljs_${Date.now()}.xlsx`;
    const filepath = path.join(upload_dir, filename);
    console.log(filepath);
    try {
      await workbook.xlsx.writeFile(filepath);
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

    const workbook = new ExcelJS.Workbook();
    try {
      await workbook.xlsx.load(req.file.buffer);
      const worksheet = workbook.getWorksheet(1);
      const data = [];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        const result = {};
        row.eachCell((cell, colNumber) => {
          const columnName = worksheet.getRow(1).getCell(colNumber).value;
          result[columnName] = cell.value;
        });
        data.push(result);
      });

      display.end_result(res, 200, data);
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
    if (!req.files || !req.files.excel_file) {
      display.end_result(res, error.status || 400, {
        message: "file has to be uploaded.",
      });
      return;
    }

    const excel_file = req.files.excel_file;
    const workbook = new ExcelJS.Workbook();
    try {
      await workbook.xlsx.load(excel_file.data);
      const worksheet = workbook.getWorksheet(1);
      const data = [];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        const result = {};
        row.eachCell((cell, colNumber) => {
          const columnName = worksheet.getRow(1).getCell(colNumber).value;
          result[columnName] = cell.value;
        });
        data.push(result);
      });

      display.end_result(res, 200, data);
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
