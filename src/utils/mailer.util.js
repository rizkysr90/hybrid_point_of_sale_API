const nodemailer = require("nodemailer");


let transporter = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.MAILER_EMAIL, 
        pass: process.env.MAILER_PASSWORD, 
    },
});


module.exports = transporter;