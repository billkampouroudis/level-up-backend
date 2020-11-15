import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
const JWTStrategy = Strategy;
const ExtractJWT = ExtractJwt;

let options = {};
options.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
options.secretOrKey = process.env.JWT_SECRET || 'secret_key';

const initPassport = () => passport.use(
  new JWTStrategy(options, function (jwtPayload, done) {
    return done(null, jwtPayload);
  })
);

export default initPassport;
