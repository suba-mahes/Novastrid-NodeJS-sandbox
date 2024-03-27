var express = require('express');
var query = require('../controller/sql_query');
var validation = require('../middleware/validation_user')

var router = express.Router();

router.get('/get-allusers',query.getAllUsers);
router.get('/get-user-by-id/:id',query.getUserByID);
router.post('/insert-user', validation.validation_user, query.create);
router.delete('/delete-user-by-id/:id',query.deleteUserByID);
router.put('/update-user/:id',query.update);


module.exports = router;
