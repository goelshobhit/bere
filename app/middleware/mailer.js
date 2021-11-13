const nodemailer = require("nodemailer");

let transport = nodemailer.createTransport({
  host: process.env.AD_SMTP_HOST,
  port: process.env.AD_SMTP_PORT,
  auth: {
    user: process.env.AD_SMTP_USER,
    pass: process.env.AD_SMTP_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

let sendMail = message => {
  transport.sendMail(message, function(err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

module.exports = {
  sendMail: sendMail
};
