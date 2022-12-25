const nodeMailer = require("nodemailer");
const config = require("../config/config")

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host:config.SMPT_HOST,
    port: config.SMPT_PORT,
    service: config.SMPT_SERVICE,
    secure:false,
    auth: {
      user: config.SMPT_MAIL,
      pass: config.SMPT_PASSWORD,
    },
    tls: {
        rejectUnauthorized: true
    }
  });

  const mailOptions = {
    from: config.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;