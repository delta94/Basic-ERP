const nodemailer = require('nodemailer');

/**
 * This method allow Node App to send email to the
 *  client with specific transporter (HOST, PORT)
 *
 * Requires to have config.env file to read HOST, PORT
 *  USERNAME & PASSWORD
 *
 * Options are provided to custom the Destination
 *  address, subject and contents
 * @param {*} options
 */
exports.sendEmail = async (options) => {
  // TODO 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // TODO 2) Define the email options
  const mailOptions = {
    from: 'TravelS Security<travels_security@travels.io>',
    to: options.email,
    subject: options.subject,
    text: options.message
    // html:
  };

  // TODO 3) Actually send the email
  await transporter.sendMail(mailOptions);
};
