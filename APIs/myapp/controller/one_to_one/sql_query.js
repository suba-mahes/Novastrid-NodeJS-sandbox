var sql_connection = require("../../model/connection_db.js");
var display = require("../../controller/result_display.js");

module.exports.getAllUsers = async (req, res) => {
  try {
    try {
      const [results, feilds] = await sql_connection.query(
        "select u.user_id,u.first_name,u.last_name,u.email_id,a.address1,a.address2,a.city, a.state, a.country from users u join user_addresses a on u.user_id = a.user_id;"
      );

      display.end_result(res, 200, results);
    } catch (err) {
      display.end_result(res, err.status || 500, { message: err.message });
    }
  } catch (error) {
    display.end_result(res, error.status, { message: error.message });
  }
};

module.exports.getUserByID = async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    try {
      if (!id) {
        display.end_result(res, 404, { message: "parameter is empty" });
        return;
      }
      const [results, feilds] = await sql_connection.query(
        "select u.user_id,u.first_name,u.last_name,u.email_id,a.address1,a.address2,a.city, a.state, a.country from users u join user_addresses a on u.user_id = a.user_id where u.user_id = ?",
        [id]
      );
      if (results.length) {
        display.end_result(res, 200, results[0]);
        return;
      } else {
        display.end_result(res, 404, { message: "user is not found" });
        return;
      }
    } catch (err) {
      display.end_result(res, err.status || 500, { message: err.message });
      return;
    }
  } catch (error) {
    display.end_result(res, error.status, { message: error.message });
  }
};

module.exports.create = async (req, res) => {
  try {
    const user = req.body;
    const {
      first_name,
      last_name,
      email_id,
      address1,
      address2,
      city,
      state,
      country,
    } = user;
    let createdAt = new Date().toJSON().slice(0, 10);
    let updatedAt = new Date().toJSON().slice(0, 10);
    try {
      const [user_results] = await sql_connection.query(
        "insert into users (first_name, last_name, email_id,createdAt, updatedAt) values(?,?,?,?,?) ",
        [first_name, last_name, email_id, createdAt, updatedAt]
      );
      if (user_results.affectedRows) {
        let user_id = user_results.insertId;
        try {
          const [user_address_results] = await sql_connection.query(
            "insert into user_addresses (address1, address2, city, state, country,user_id, createdAt, updatedAt) values(?,?,?,?,?,?,?,?) ",
            [
              address1,
              address2,
              city,
              state,
              country,
              user_id,
              createdAt,
              updatedAt,
            ]
          );
          if (user_address_results.affectedRows == 0) {
            display.end_result(res, 404, {
              message: "insertion failed at address",
            });
            return;
          } else {
            display.end_result(res, 200, { message: "inserted successfully" });
            return;
          }
        } catch (err) {
          display.end_result(res, err.status || 500, { message: err.message });
          return;
        }
      } else {
        display.end_result(res, 404, { message: "insertion failed" });
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

module.exports.update = async (req, res) => {
  try {
    const user = req.body;
    const id = parseInt(req.params.id);
    const {
      first_name,
      last_name,
      email_id,
      address1,
      address2,
      city,
      state,
      country,
    } = user;

    let updated_at = new Date().toJSON().slice(0, 10);
    try {
      const [user_results] = await sql_connection.query(
        `update users u join user_addresses a on u.user_id = a.user_id set u.first_name = ?,  u.last_name = ?, u.email_id = ?, u.updatedAt = ?, a.address1 = ?, a.address2 = ?, a.city= ?, a.state = ?, a.country = ?, a.updatedAt = ? where u.user_id = ? And a.user_id = ? `,
        [
          first_name,
          last_name,
          email_id,
          updated_at,
          address1,
          address2,
          city,
          state,
          country,
          updated_at,
          id,
          id,
        ]
      );
      if (user_results.affectedRows) {
        display.end_result(res, 200, { message: "updated successfully" });
        return;
      } else {
        display.end_result(res, 404, { message: "updation failed" });
        return;
      }
    } catch (err) {
      display.end_result(res, err.status || 500, { message: err.message });
      return;
    }
  } catch (error) {
    display.end_result(res, error.status, { message: error.message });
  }
};

module.exports.deleteUserByID = async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    console.log(id);
    try {
      if (!id) {
        display.end_result(res, 404, { message: "parameter is empty" });
        return;
      }

      const [user_results] = await sql_connection.query(
        "delete from users u where u.user_id = ?",
        [id]
      );
      if (user_results.affectedRows) {
        display.end_result(res, 200, { message: "deleted successfully" });
        return;
      } else {
        display.end_result(res, 404, { message: "user is not found" });
        return;
      }
    } catch (err) {
      display.end_result(res, err.status || 500, { message: err.message });
      return;
    }
  } catch (error) {
    display.end_result(res, error.status, { message: error.message });
  }
};

// function EndResult(res,res_status,result)
// {
//     res.format({
//       "application/json"(){
//         res.status(res_status);
//         res.json(result);
//       }
//     })
// }
