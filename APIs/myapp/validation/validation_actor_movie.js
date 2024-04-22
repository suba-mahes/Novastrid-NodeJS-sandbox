exports.validation_create = (data) => {
  if (!data.actor_id || !data.movie_id) {
    return false;
  } else {
    return true;
  }
};

exports.validation_update = (data) => {
  if (!data.actor_id && !data.movie_id) {
    return false;
  } else {
    return true;
  }
};
