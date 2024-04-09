const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'insu041831@gmail.com',
      pass: 'ialw aubx wzlp nmuy'
    }
});

module.exports = transporter;