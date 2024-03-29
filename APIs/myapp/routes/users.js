var express = require('express');
var query = require('../controller/sql_query');
var login = require('../controller/login');
var validation = require('../middleware/validation_user_create')
var auth = require('../middleware/auth')

var router = express.Router();

router.post('/login',auth.login);
router.post('/register', auth.reqister);

router.get('/get-allusers',query.getAllUsers);
router.get('/get-user-by-id/:id',query.getUserByID);
router.post('/insert-user', validation.validation_user, query.create);
router.delete('/delete-user-by-id/:id',query.deleteUserByID);
router.put('/update-user/:id', validation.validation_user, query.update);


module.exports = router;
