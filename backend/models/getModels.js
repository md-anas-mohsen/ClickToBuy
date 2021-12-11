const initModels = require("../models/init-models");
const sequelize = require("../config/database");
const models = initModels(sequelize);

module.exports = { ...models };
