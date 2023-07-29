const nodemailer = require("nodemailer");



let sendMail = async message => {
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
  try {
    await transport.sendMail(message)
  } catch (error) {
    console.log(error)
    throw error
  }

};

module.exports = {
  sendMail: sendMail
};
