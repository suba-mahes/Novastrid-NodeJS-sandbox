var express = require("express");
const general = require("../../controller/many_to_many/general");
var validation = require("../../middleware/many_to_many/validation_create");

var router = express.Router();

router.get("/get-only-allactors", general.findAllActor);
router.get("/get-only-actor-by-id/:id", general.findIDActor);
router.get("/get-only-allmovies", general.findAllMovie);
router.get("/get-only-movie-by-id/:id", general.findIDMovie);

router.post("/insert", validation.validation_actor_movie, general.create);
// router.put('/update-movie/:actor_id',general.updateMovie);
// router.put('/update-movie/:movie_id',general.updateActor);
router.delete("/delete-by-id/:movie_id/:actor_id", general.deleteByID);

module.exports = router;
