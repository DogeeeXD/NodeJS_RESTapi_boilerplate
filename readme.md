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
- Run `yarn install`
- Add your database configuration in `src/config/config.json`
- Switch between different `db_environment` if necessary.
- Run in dev mode using `yarn run dev`

## Deploy for production
### On Windows:
- Download `rimraf`(Replacement for rm- rd on windows):
    `npm install rimraf`
- Run `yarn build` script to generate the build folder
- The `yarn build` script download dependencies, generates build, then copy `config.json` file to `build/config` 
- Upload the build folder to your server
- Run `nodemon index.js` from server to start

### On UNIX based OS:
- edit `package.json`, 
    under `script` => `clean`, 
    edit `rimraf build && mkdir build` to `rm -rf build && mkdir build`
- Run `yarn build` script to generate the build folder
- The `yarn build` script download dependencies, generates build, then copy `config.json` file to `build/config` 
- Upload the build folder to your server
- Run `nodemon index.js` from server to start

### For automated update process
- Clone the repository to your server
- Run `yarn build` to generate the build folder
- (Optional) To change build folder location, 

edit `package.json`,

under `script` => `build-server`,

change `./build` to your desired location 

- Create a script to run `nodemon index.js` on OS startup
- When you need to update the running NodeJS, just edit/pull updated files then run `yarn build` again, it will generate the build folder again, then nodemon will detect changes and restart NodeJS service automatically.
