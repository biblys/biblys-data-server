module.exports = function(req, res, next) {
  if (!req.user.isAdmin) {
    res.status(403).send({ error: 'You must be an administrator to do this' });
    return;
  }

  next();
};
