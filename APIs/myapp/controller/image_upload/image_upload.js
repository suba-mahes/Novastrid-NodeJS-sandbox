var display = require("../../controller/result_display.js");

const path = require("path");

const upload_dir = "I:\node_jsNovastrid-NodeJS-sandboxAPIsmyapp\file_images";

exports.getImage = async (req, res) => {
  try {
    const file_name = req.params.imageName;
    console.log(file_name);
    res.sendFile(file_name, { root: "file_images" });
  } catch (err) {
    display.end_result(res, err.status || 500, {
      message: err.message || "Some error occurred.",
    });
  }
};

exports.insertImage = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      display.end_result(res, 400, { error: "No files were uploaded" });
      return;
    }

    const image = req.files.image;

    image.mv(path.join(upload_dir, image.name), (err) => {
      if (err) {
        console.error("Error saving image:", err);
        display.end_result(res, 400, { error: "No files were uploaded" });
        return;
      }
    });
    display.end_result(res, 200, {
      message: "Image uploaded successfully" + image.name,
    });
  } catch (err) {
    display.end_result(res, err.status || 500, {
      message: err.message || "Some error occurred.",
    });
  }
};
