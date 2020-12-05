import passport from 'passport';

function auth(req, res, next, permissions = []) {
  passport.authenticate('jwt', { session: false }, function (err, user, info) {
    if (user) {
      if (permissions.length > 0) {
        // TODO: permissions.includes(user.role)
      } else {
        // TODO: allow
      }
    }
    return next();
  })(req, res, next);
}

export default auth;
