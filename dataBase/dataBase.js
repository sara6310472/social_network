require('dotenv').config();

const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');

(async () => {
  const connection = await mysql.createConnection({
    host: process.env.SERVER_HOSTNAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  await connection.query("CREATE DATABASE IF NOT EXISTS `socialNetwork`;");
  await connection.end();
})();

const sequelize = new Sequelize("socialNetwork", process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.SERVER_HOSTNAME,
  dialect: process.env.DB_DIALECT,
  port: process.env.DB_PORT,
});

sequelize
  .authenticate()
  .then(() => console.log("Successfully connected to newly created MySQL DB"))
  .catch((err) => console.error("Error connecting to MySQL:", err));

module.exports = sequelize;
