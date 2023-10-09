function addCsrfToken(req, res, next) {
  res.locals.addCsrfToken = req.csrfToken();
  next();
}

module.exports = addCsrfToken;
