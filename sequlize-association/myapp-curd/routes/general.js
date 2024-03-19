var express = require('express');
const general = require('../controller/general');

var router = express.Router();

router.get('/get-only-allactors',general.findAllActor);
router.get('/get-only-actor-by-id/:id',general.findIDActor);
router.get('/get-only-allmovies',general.findAll);
router.get('/get-only-movie-by-id/:id',general.findID);

router.post('/insert',general.create);
router.put('/update/:id',general.update);
//router.put('/update-movie/:id',general.updateMovie);
router.delete('/delete-general-by-id/:id',general.deleteByID);


module.exports = router;
