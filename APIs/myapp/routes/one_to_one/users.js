var express = require('express');
var query = require('../../controller/one_to_one/sql_query');
var login = require('../../controller/auth/login');
var register = require('../../controller/auth/register');

var validation = require('../../middleware/one_to_one/validation_user_create')
var auth = require('../../middleware/auth/auth')

var router = express.Router();

router.post('/login',auth.login);
router.post('/register', auth.reqister, register.register_with_sql);

router.get('/get-allusers',query.getAllUsers);
router.get('/get-user-by-id/:id',query.getUserByID);
router.post('/insert-user', validation.validation_user, query.create);
router.delete('/delete-user-by-id/:id',query.deleteUserByID);
router.put('/update-user/:id', validation.validation_user, query.update);


module.exports = router;
