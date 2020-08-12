import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import models from '../models'

// models.xxxx , xxxx = table name same as in /models/user.js
const Users = models.USER;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// Secret key must be same as the one used to issue token
opts.secretOrKey = 'secret';
// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';

// create jwt strategy
module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      Users.findAll({ where: { LOGINID: jwt_payload.username } })
        .then(user => {
          if (user.length) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};
