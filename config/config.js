require('dotenv').config();

module.exports = {
  "development": {
    "username": 'postgres',
    "password": `${process.env.DB_PASSWORD}`,
    "database": `${process.env.DB_NAME}`,
    "host": "localhost",
    "dialect": "postgres",
  },
  "test": {
    "username": "postgres",
    "password": process.env.DB_PASSWORD,
    "database": "momby_test",
    "host": "localhost",
    "dialect": "postgres"
  },
  "production": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.PROD_DB_HOST,
    "dialect": "postgres"
  }
}