var express = require('express');
const users = require('../controller/user.js');

var router = express.Router();

router.get('/get-allusers',users.findAll);
// router.get('/get-user-by-id/:id',users.getUserByID);
// router.post('/insert-user',users.create);
// router.delete('/delete-user-by-id/:id',users.deleteUserByID);
// router.put('/update-user/:id',users.update);



module.exports = router;
