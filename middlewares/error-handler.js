function handleErrors(error, req, res, next) {
  console.log(error);
  res.status(500).render("shared/500");

  if (error.code === 404) {
    return res.status(404).render("shared/404");
  }
}

module.exports = handleErrors;
