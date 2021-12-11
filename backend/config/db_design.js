const fs = require("fs");

const sequelize = require("./database");

const tables = fs.readFileSync(`${__dirname}/create_tables.sql`, "utf8");

sequelize.query(tables);
