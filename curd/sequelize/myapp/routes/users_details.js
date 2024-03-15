var express = require('express');
const users_detail = require('../controller/user_details.js');

var router = express.Router();

router.get('/get-allusers',users_detail.findAll);
router.get('/get-user-by-id/:id',users_detail.findID);
router.post('/insert-user',users_detail.create);
router.put('/update-user/:id',users_detail.update);
router.delete('/delete-user-by-id/:id',users_detail.deleteByID);
router.delete('/delete-allusers',users_detail.deleteAll);


module.exports = router;
