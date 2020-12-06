import passport from 'passport';
import { ForbiddenError } from '../constants/errors';

function auth(req, res, next, permissions = []) {
  // eslint-disable-next-line no-unused-vars
  passport.authenticate('jwt', { session: false }, function (err, user, info) {
    if (user) {
      if (permissions.length > 0) {
        if (permissions.includes(user.role)) {
          return next();
        }

        return next(new ForbiddenError('No right permissions'));
      }
    }

    return next(new ForbiddenError('Login required'));
  })(req, res, next);
}

export default auth;
