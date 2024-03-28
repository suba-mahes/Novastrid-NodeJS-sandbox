var express = require('express');
const users_detail = require('../controller/user_details.js');
var validation = require('../middleware/validation_user_create.js');
var validation_update = require('../middleware/validation_user_update.js');

var router = express.Router();

router.get('/get-allusers',users_detail.findAll);
router.get('/get-user-by-id/:id',users_detail.findID);
router.post('/insert-user', validation.validation_user_detail, users_detail.create);
router.put('/update-user/:id',validation_update.validation_user_detail, users_detail.update);
router.delete('/delete-user-by-id/:id',users_detail.deleteByID);


module.exports = router;
