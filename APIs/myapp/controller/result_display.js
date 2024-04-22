module.exports.end_result = (res, res_status, result) => {
  res.format({
    "application/json"() {
      res.status(res_status);
      res.json(result);
    },
  });
};

module.exports.end_error_result = (res, error) => {
  res.format({
    "application/json"() {
      res.status(error.status || 500);
      res.json({
        message: error.message || "Some error occurred.",
      });
    },
  });
};
