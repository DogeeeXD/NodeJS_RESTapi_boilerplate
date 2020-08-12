# NodeJS RESTapi Boilerplate
This is a boilerplate code for creating a simple REST API with NodeJS.
Some codes are written in ES6 and compiled to ES5 using babel.

## Features
- REST API routing(Express)
- Database connection (Sequelize)
- User Authentication (PassportJS & JWT)
- Password Encryption (BcryptJS)
- Access level control
- CORS
- Basic logging (Morgan & rotating-file-stream)

## To get started
- Download and install NodeJS:
https://nodejs.org/en/
- Download and install yarn package manager using npm:
`npm install -g yarn`
- Download and install Nodemon using npm:
`npm install nodemon -g`

## For development
- run `yarn install`
- add your database configuration in `src/config/config.json`
- Run in dev mode using `yarn run dev`

## Deploy for production,
### On Windows:
- download `rimraf` (Replacement for rm- rd on windows):

    `npm install rimraf`

- run `yarn build` to generate the build folder
- copy `src/config/config.json` to `build/config/`
- upload the build folder to your server
- run `nodemon index.js` from server to start

### On UNIX based OS:
- edit `package.json`, 
    under `script` => `clean`, 
    edit `rimraf build && mkdir build` to `rm -rf build && mkdir build`
- run `yarn run build` to generate the build folder
- copy `src/config/config.json` to `build/config/`
- upload the `build` folder to your server
- run `nodemon index.js` from `build` folder to start
