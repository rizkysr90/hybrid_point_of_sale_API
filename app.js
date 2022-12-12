require('dotenv').config();
const express = require('express');
const authRoutes = require('./src/routes/auth.route.js');
const morgan = require('morgan');
const app = express();

app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/',(req,res) => {
    res.json('Hello World');
});

app.use('/auth', authRoutes);




app.use((err, req, res, next) => {
    console.error(err.message);
    const statusCode = err.error_code || 500;
    const data = err.data || {};
    const resBody = {
        metadata : {
            status: statusCode,
            msg : err.message,
        },
        data
    }
    res.status(statusCode).json(resBody);
  });
module.exports = app;