require("dotenv").config();

module.exports = {
  development: {
    username: "postgres",
    password: `${process.env.DB_PASSWORD}`,
    database: `${process.env.DB_NAME}`,
    host: "localhost",
    dialect: "postgres",
    dialectOptions: {
      useUTC: false, //for reading from database
      dateStrings: true,
      typeCast: function (field, next) {
        // for reading from database
        if (field.type === "DATETIME") {
          return field.string();
        }
        return next();
      },
    },
    timezone: "+07:00",
    logging: false,
  },
  test: {
    username: "postgres",
    password: process.env.DB_PASSWORD,
    database: "momby_test",
    host: "localhost",
    dialect: "postgres",
  },
  production: {
    username: `${process.env.DB_USERNAME}`,
    password: `${process.env.DB_PASSWORD}`,
    database: `${process.env.DB_NAME}`,
    host: `${process.env.DB_PASSWORD}`,
    port: `${process.env.DB_PORT}`,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
      useUTC: false, //for reading from database
      dateStrings: true,
      typeCast: function (field, next) {
        // for reading from database
        if (field.type === "DATETIME") {
          return field.string();
        }
        return next();
      },
    },
    timezone: "+07:00",
    logging: false,
  },
};
