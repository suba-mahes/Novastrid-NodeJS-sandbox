const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

var sql_connection = require("../../../model/connection_db.js");
var display = require("../../result_display.js");
var secret_key = require("../../../config/config_auth.js");

module.exports.register_with_sql = async (req, res) => {
  try {
    const { name, email_id, password } = req.body;
    const hashed_password = await bcrypt.hash(password, 10);

    const [auth_results, auth_feilds] = await sql_connection.query(
      "select * from auths a where a.email_id = ?",
      [email_id]
    );
    if (auth_results.length) {
      display.end_result(res, 200, { message: "Already registerd email_id" });
      return;
    }

    try {
      const [results] = await sql_connection.query(
        "insert into auths (name, email_id, password) values(?,?,?) ",
        [name, email_id, hashed_password]
      );
      if (results.affectedRows) {
        const token = jwt.sign(
          { auth_id: results.insertId, email_id: email_id },
          secret_key,
          { expiresIn: "1h" }
        );
        display.end_result(res, 200, {
          message: "registered successfully",
          token: token,
        });
      } else {
        display.end_result(res, 404, { message: "registeration failed" });
        return;
      }
    } catch (err) {
      display.end_result(res, 500, { message: err.message });
      return;
    }
  } catch (error) {
    display.end_result(res, 500, { message: error.message });
  }
};

module.exports.login_with_sql = async (req, res) => {
  try {
    const { email_id, password } = req.body;
    try {
      const [auth_results, auth_feilds] = await sql_connection.query(
        "select * from auths a where a.email_id = ?",
        [email_id]
      );

      if (auth_results.length) {
        const passwordMatch = await bcrypt.compare(
          password,
          auth_results[0].password
        );

        if (!passwordMatch) {
          display.end_result(res, 401, { message: "Invalid password" });
          return;
        }

        const token = jwt.sign(
          { auth_id: auth_results[0].auth_id, email_id: email_id },
          secret_key,
          { expiresIn: "1h" }
        );

        display.end_result(res, 200, {
          message: "logged in successfully",
          token: token,
        });
      } else {
        display.end_result(res, 404, { message: "user is not found" });
        return;
      }
    } catch (err) {
      display.end_result(res, err.status || 500, { message: err.message });
      return;
    }
  } catch (error) {
    display.end_result(res, 500, { message: error.message });
  }
};

module.exports.welcome = async (req, res) => {
  try {
    const email_id = req.email_id;
    try {
      const [results, feilds] = await sql_connection.query(
        "select u.user_id,u.first_name,u.last_name,u.email_id from users u where u.email_id = ?",
        [email_id]
      );
      if (results.length) {
        display.end_result(res, 200, results[0]);
        return;
      } else {
        try {
          const [auth_results, auth_feilds] = await sql_connection.query(
            "select * from auths a where a.email_id = ?",
            [email_id]
          );
          if (auth_results.length) {
            display.end_result(res, 200, {
              name: auth_results[0].name,
              message: auth_results[0].name + " Please fill up other details",
            });
            return;
          } else {
            display.end_result(res, 404, { message: "user is not found" });
            return;
          }
        } catch (err) {
          display.end_result(res, err.status || 500, { message: err.message });
          return;
        }
      }
    } catch (err) {
      display.end_result(res, err.status || 500, { message: err.message });
      return;
    }
  } catch (error) {
    display.end_result(res, 500, { message: error.message });
  }
};
