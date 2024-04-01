const ExcelJS = require('exceljs');
var display = require("../result_display.js");


const path = require('path');

const uploadDir = 'I:\node_js\Novastrid-NodeJS-sandbox\APIs\myapp\excel-download';

exports.uploadExcel =  async(req,res) => {
  try{

    const data = req.body;

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet('cricket');

    worksheet.columns = [
      { key: 'id', header: 'S.No' },
      { key: 'player_name', header: 'Player Name' },
      { key: 'team_name', header: 'Team Name' },
    ];

    data.forEach(item => {
      worksheet.addRow(item);
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="output.xlsx"');

    await workbook.xlsx.write(res)

    // const filename = `output_${Date.now()}.xlsx`;
    // const filepath = path.join(__dirname, filename);
    // await workbook.xlsx.writeFile(filepath);
    //res.sendFile(filepath);
  }
  catch(err){
    display.end_result(res,err.status || 500,{"message": err.message || "Some error occurred."});
  }
};
