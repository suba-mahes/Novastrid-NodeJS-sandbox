var express = require('express');
const actor = require('../controller/actor');

var router = express.Router();

router.get('/get-allactors',actor.findAll);
router.get('/get-actor-by-id/:id',actor.findID);
router.get('/get-actor-by-first-name/:name',actor.findByName);
router.post('/insert-actor',actor.create);
router.put('/update-actor/:id',actor.update);
router.delete('/delete-actor-by-id/:id',actor.deleteByID);


module.exports = router;
