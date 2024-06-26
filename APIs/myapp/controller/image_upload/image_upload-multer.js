var display = require("../../controller/result_display.js");

exports.getImage = async (req, res) => {
  try {
    const file_name = req.params.imageName;
    res.sendFile(file_name, { root: "file_images" });
  } catch (err) {
    display.end_error_result(res, err);
  }
};

exports.insertImage = async (req, res) => {
  try {
    if (req.file) {
      display.end_result(res, 200, {
        message: "Image uploaded successfully" + image.name,
      });
      return;
    } else {
      display.end_result(res, 400, { error: "No files were uploaded" });
    }
  } catch (err) {
    display.end_error_result(res, err);
  }
};
