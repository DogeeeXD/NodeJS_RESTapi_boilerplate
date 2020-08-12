import passport from 'passport';
import config from '../config/config';
import { allowOnly } from '../services/routesHelper';
import { create, getAllUsers, userLogin, getRefreshedToken, testInsert} from '../controllers/user';

module.exports = (app) => {

  // Create a new user
  app.post(
    '/api/users/create',
    passport.authenticate('jwt', { session: false }),
    allowOnly(config.accessLevels.admin, create)
  );

  // Get all username list
  app.get(
    '/api/users',
    allowOnly(config.accessLevels.admin, getAllUsers)
  )

  // User Login
  app.post(
    '/api/users/login',
    userLogin
  )

  // Refresh access token
  app.post(
    '/api/users/token',
    getRefreshedToken
  )

};
