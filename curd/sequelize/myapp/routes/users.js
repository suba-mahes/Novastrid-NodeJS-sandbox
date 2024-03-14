var express = require('express');
const users = require('../controller/user.js');

var router = express.Router();

router.get('/get-allusers',users.findAll);
router.get('/get-user-by-id/:id',users.findID);
router.post('/insert-user',users.create);
router.put('/update-user/:id',users.update);
router.delete('/delete-user-by-id/:id',users.deleteByID);
router.delete('/delete-allusers',users.deleteAll);


module.exports = router;
