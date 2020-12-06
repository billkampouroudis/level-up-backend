import passport from 'passport';
import { ForbiddenError } from '../constants/errors';
import get from '../utils/misc/get';

function auth(req, res, next, permissions = []) {
  // eslint-disable-next-line no-unused-vars
  passport.authenticate('jwt', { session: false }, function (err, user, info) {
    if (user) {
      if (Array.isArray(permissions) && permissions.length > 0) {
        for (let item of user.stores) {
          if (permissions.includes(get(() => item.store_user.userRole))) {
            return next();
          }
        }

        return next(new ForbiddenError('No right permissions'));
      }
    }

    return next(new ForbiddenError('Login required'));
  })(req, res, next);
}

export default auth;
