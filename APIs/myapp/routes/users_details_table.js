var express = require('express');
const users_detail = require('../controller/user_details_table.js');
var validation = require('../middleware/validation_user_create.js')

var router = express.Router();

router.get('/get-allusers',users_detail.findAll);
router.get('/get-user-by-id/:id',users_detail.findID);
router.post('/insert-user', validation.validation_user_detail_table, users_detail.create);
router.put('/update-user/:id',users_detail.update);
router.delete('/delete-user-by-id/:id',users_detail.deleteByID);
router.delete('/delete-user-by-address-id/:user_id/:id',users_detail.deleteByAddressID);


module.exports = router;
