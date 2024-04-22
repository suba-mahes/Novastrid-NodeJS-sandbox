exports.validation_create_actor = (data) => {
  if (!data.first_name || !data.last_name || !data.movies) {
    return false;
  } else {
    for (const movie of data.movies) {
      if (!movie.movie_name) {
        return false;
      }
    }
    return true;
  }
};

exports.validation_actor = (data) => {
  if (!data.first_name && !data.last_name) {
    return false;
  } else {
    return true;
  }
};
