const Sequelize = require("sequelize");
const dotenv = require("dotenv").config({ path: "backend/config/config.env" });

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.USER,
  process.env.PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
    dialectOptions: {
      multipleStatements: true,
    },
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log(
      `Connected to MySQL database '${process.env.DATABASE}' successfully.`
    );
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

testConnection();

module.exports = sequelize;

// // const mysql = require("mysql");

// // const db = mysql.createConnection({
// //   hostname: process.env.HOSTNAME,
// //   user: process.env.USER,
// //   password: process.env.PASSWORD,
// //   database: process.env.DATABASE,
// // });

// const connectDB = () => {
//   //   db.connect((err) => {
//   //     if (err) {
//   //       console.error(err);
//   //     } else {
//   //       console.log("MySQL Connected");
//   //     }
//   //   });
// };

// // module.exports = db;
// module.exports = connectDB;
