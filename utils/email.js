const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `the website <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    const CLIENT_ID =
      '1008215457370-huolfk2hdgm8cfdj3oruaqs9d4c6rsf7.apps.googleusercontent.com';
    const CLEINT_SECRET = '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';
    const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
    const REFRESH_TOKEN =
      '1//04B25Gv9y_ObICgYIARAAGAQSNwF-L9Ir3UJ_BLyNk0XjcndwdgRxz8fIobGkfQMIXOzX7-hgtTqeVxTY7MzlMEe5E1IsSwe8Qec';

    const oAuth2Client = new google.auth.OAuth2(
      CLIENT_ID,
      CLEINT_SECRET,
      REDIRECT_URI
    );
    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
    const accessToken = oAuth2Client.getAccessToken();
    if (process.env.NODE_ENV === 'development') {
      // Sendgrid
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: 'abdelmomenelshatory@gmail.com',
          clientId: CLIENT_ID,
          clientSecret: CLEINT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: accessToken
        }
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Website test Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
};

// const sendEmail = async options => {
//   // 1) Create a transporter
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD
//     }
//   });

//   // 2) Define the email options
//   const mailOptions = {
//     from: 'Jonas Schmedtmann <hello@jonas.io>',
//     to: options.email,
//     subject: options.subject,
//     text: options.message
//     // html:
//   };

//   // 3) Actually send the email
//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;
