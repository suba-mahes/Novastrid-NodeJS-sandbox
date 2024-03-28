var express = require('express');
const movie = require('../controller/movie');
var validation = require('../middleware/validation')

var router = express.Router();

router.get('/get-allmovies',movie.findAll);
router.get('/get-movie-by-id/:id',movie.findID);
router.post('/insert-movie', validation.validation_movie, movie.create);
router.post('/insert-movie/with-actor-id', validation.validation_movie_with_actor_id, movie.create_with_actor_id);
router.put('/update-movie/:id',movie.update);
router.delete('/delete-movie-by-id/:id',movie.deleteByID);


module.exports = router;
