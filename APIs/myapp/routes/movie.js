var express = require('express');
const movie = require('../controller/movie');

var router = express.Router();

router.get('/get-allmovies',movie.findAll);
router.get('/get-movie-by-id/:id',movie.findID);
router.post('/insert-movie',movie.create);
router.put('/update-movie/:id',movie.update);
router.delete('/delete-movie-by-id/:id',movie.deleteByID);


module.exports = router;
