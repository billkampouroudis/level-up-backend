import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { models } from '../models';

const JWTStrategy = Strategy;
const ExtractJWT = ExtractJwt;

let options = {};
options.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
options.secretOrKey = process.env.JWT_SECRET || 'secret_key';

const initPassport = () =>
  passport.use(
    new JWTStrategy(options, async function (jwtPayload, done) {
      const { User, Store } = models;
      const user = await User.findOne({
        where: { id: jwtPayload.user.id },
        include: Store
      });

      if (user) {
        return done(null, user);
      }

      return done(true, false);
    })
  );

export default initPassport;
