const path = require("path");

const { DB_NAME, DB_USER, DB_PASS } = require(path.resolve(
  "database",
  "config",
  "environment.js"
));
const databaseConfig = {
  localhost: {
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    host: "127.0.0.1",
    dialect: "mysql",
    logging: false,
  },
  test: {
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    host: "127.0.0.1",
    dialect: "mysql",
  },
};

module.exports = databaseConfig;
