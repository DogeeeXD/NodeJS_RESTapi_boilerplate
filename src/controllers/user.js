import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import db from '../models';
import { accessLogStream } from '../index.js';

// db.xxxx , xxxx = table name same as /models/user.js
const User = db.USER;

// load input validation
import validateRegisterForm from '../validation/register';
import validateLoginForm from '../validation/login';

// A list to store refresh tokens temporarily
// Consider using storage for production
var refreshTokensList = {};


// Using Sequelize's method will allow Sequelize to automatically use queries
// fitted to the target database.

// Alternatively, use raw query to have custom query commands.

// Sequelize's methods
//---------------------------------------------------------------------------

// ********************************************************************************
// Create user using Sequelize's method without using raw query
const create = (req, res) => {
  const { errors, isValid } = validateRegisterForm(req.body);
  let {
    role,
    username,
    email,
    password,
  } = req.body;

  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findAll({ where: { email } }).then(user => {
    if (user.length) {
      return res.status(400).json({ email: 'Email already exists!' });
    } else {
      let newUser = {
        role,
        username,
        email,
        password,
      };
      bcrypt.genSalt(12, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          User.create(newUser)
            .then(user => {
              res.json({ user });
            })
            .catch(err => {
              res.status(500).json({ err });
            });
        });
      });
    }
  });
};

// ********************************************************************************
// Login user
const login = (req, res) => {
  const { errors, isValid } = validateLoginForm(req.body);

  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email, password } = req.body;

  User.findAll({
    where: {
      email
    }
  })
    .then(user => {

      //check for user
      if (!user.length) {
        errors.email = 'User not found!';
        return res.status(404).json(errors);
      }

      let originalPassword = user[0].dataValues.password

      //check for password
      bcrypt
        .compare(password, originalPassword)
        .then(isMatch => {
          if (isMatch) {
            // user matched
            console.log('matched!')
            const { id, username } = user[0].dataValues;
            const payload = { id, username }; //jwt payload

            jwt.sign(payload, 'secret', {
              expiresIn: 3600
            }, (err, token) => {
              res.json({
                success: true,
                token: 'Bearer ' + token,
                role: user[0].dataValues.role
              });
            });
          } else {
            errors.password = 'Password not correct';
            return res.status(400).json(errors);
          }
        }).catch(err => console.log(err));
    }).catch(err => res.status(500).json({ err }));
};

// ********************************************************************************
// fetch all users
const findAllUsers = (req, res) => {
  User.findAll()
    .then(user => {
      res.json({ user });
    })
    .catch(err => res.status(500).json({ err }));
};

// ********************************************************************************
// fetch user by userId
const findById = (req, res) => {
  const id = req.params.userId;

  User.findAll({ where: { id } })
    .then(user => {
      if (!user.length) {
        return res.json({ msg: 'user not found' })
      }
      res.json({ user })
    })
    .catch(err => res.status(500).json({ err }));
};

// ********************************************************************************
// Update a user's info
const update = (req, res) => {
  let { username, email, password, role} = req.body;

  const id = req.params.userId;

  User.update(
    {
      username,
      email,
      password,
      role,
    },
    { where: { id } }
  )
    .then(user => res.status(200).json({ user }))
    .catch(err => res.status(500).json({ err }));
};

//---------------------------------------------------------------------------



// Raw Queries method
//---------------------------------------------------------------------------

// ********************************************************************************
// Fetch all username
const getAllUsers = (req, res) => {
  db.sequelize.query(
    "SELECT UID, USERNAME FROM USER",
  ).spread(function (results, metadata) {
    res.json(results);
  })
};

// ********************************************************************************
// Raw Query fetch username from the USERNAME column with EMAIL
const findUsersById = (req, res) => {
  const { email } = req.body;
  db.sequelize.query(
    "SELECT USERNAME FROM USER WHERE EMAIL = :email",
    {
      replacements: { email: email },
    }
  ).spread(function (results, metadata) {
    res.json(results);
  })
};

// ********************************************************************************
// Login user
const userLogin = (req, res) => {
  // Validate login form
  const { errors, isValid } = validateLoginForm(req.body);
  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { username, password } = req.body;
  db.sequelize.query(
    "SELECT UID, USERNAME, EMAIL, PWD, ROLE FROM A_USER WHERE USERNAME = :username",
    {
      replacements: { username: username },
    }
  ).spread(function (results, metadata) {

    // Check username exists
    if (!results.length) {
      errors.username = 'User not found!';
      return res.status(404).json(errors);
    }

    let hashedPassword = results[0]["PWD"]

    // Compare password in database using bcrypt
    bcrypt
      .compare(password, hashedPassword)
      .then(isMatch => {
        if (isMatch) {
          // user matched
          console.log('Matched!')
          const id = results[0]["UID"];
          const username = results[0]["USERNAME"];
          const payload = { id, username };

          var refreshToken = jwt.sign(payload, 'A-refreshing-secret', {
            'expiresIn': 86400
          });

          refreshTokensList[refreshToken] = {
            "username": username,
          };

          // Use jwt to sign payload with a secret key and generate a token
          jwt.sign(payload, 'secret', {
            'expiresIn': 3600
          }, (err, token) => {
            res.json({
              id: id,
              username: username,
              success: true,
              token: 'Bearer ' + token,
              expiresIn: 3600,
              refreshToken: refreshToken,
              role: results[0]["role"]
            });
          });

        } else {
          const msg = 'Incorrect credentials';
          return res.status(400).json(msg);
        }

      })
  }).catch(function (err) {
    var error = String(err);
    res.json(error);
    accessLogStream.write(error);
  })
};


// ********************************************************************************
// Refresh token here
const getRefreshedToken = (req, res) => {
  const { id, username, refreshToken } = req.body;
  if ((refreshToken in refreshTokensList) && (refreshTokensList[refreshToken].username == username)) {
    const payload = { id, username };
    console.log('Refreshed token given');
    jwt.sign(payload, 'secret', {
      'expiresIn': 3600
    }, (err, token) => {
      res.json({
        username: username,
        success: true,
        token: 'Bearer ' + token,
        expiresIn: 3600,
      });
    });
  }
}

//---------------------------------------------------------------------------

export {
  create,
  login,
  findAllUsers,
  findById,
  update,
  getAllUsers,
  findUsersById,
  userLogin,
  getRefreshedToken,
}