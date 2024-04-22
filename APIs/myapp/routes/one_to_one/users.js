var express = require("express");
var query = require("../../controller/one_to_one/sql_query");
var auth = require("../../controller/auth/one_to_one/auth_sql");

var validation = require("../../middleware/one_to_one/validation_user_create");
var auth_validation = require("../../middleware/auth/auth");

var router = express.Router();

router.post("/login", auth_validation.login, auth.login_with_sql);
router.post("/register", auth_validation.reqister, auth.register_with_sql);
router.get("/welcome", auth_validation.authenticate_token, auth.welcome);

router.get("/get-allusers", query.getAllUsers);
router.get("/get-user-by-id/:id", query.getUserByID);
router.post("/insert-user", validation.validation_user, query.create);
router.delete("/delete-user-by-id/:id", query.deleteUserByID);
router.put("/update-user/:id", validation.validation_user, query.update);

module.exports = router;
