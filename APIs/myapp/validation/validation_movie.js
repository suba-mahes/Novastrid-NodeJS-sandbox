exports.validation_create_movie = (data) => {
  if (!data.movie_name || !data.actors) {
    return false;
  } else {
    for (const actor of data.actors) {
      if (!actor.first_name || !actor.last_name) {
        return false;
      }
    }
    return true;
  }
};

exports.validation_movie = (data) => {
  if (!data.movie_name) {
    return false;
  } else {
    return true;
  }
};
