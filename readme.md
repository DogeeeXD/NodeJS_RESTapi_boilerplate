## To get started,
- Download and install yarn if not installed yet:
https://classic.yarnpkg.com/en/docs/install

## To test
- run `yarn install`
- add your database in `src/config/config.json`
- be sure to have `nodemon` installed: 

`npm install nodemon -g`

- yarn run dev
- if you don't have `nodemon` installed, change your `dev` script in package.json to `node --exec babel-node src/index.js`

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
