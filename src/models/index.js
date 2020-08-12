'use strict';

import fs  from 'fs';
import path  from 'path';
import Sequelize  from 'sequelize';

const basename = path.basename(__filename);
// use environment settings according to db_environment keyword in config.json
const env = require(__dirname + '/../config/config.json')['db_environment'];
const db = {};

// use settings from config.json file
const sequelize_config = require(__dirname + '/../config/config.json')[env];

let sequelize;
if (sequelize_config.use_env_variable) {
  sequelize = new Sequelize(process.env[sequelize_config.use_env_variable], sequelize_config);
} else {
  sequelize = new Sequelize(sequelize_config.database, sequelize_config.username, sequelize_config.password, sequelize_config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
