const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SGMAIL_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'pageb88@gmail.com',
    subject: 'Welcome to the Internal portnal app.',
    text: `Welcome to Fourth Bulgaria, ${name}.`
  });
}

const sendGoodByeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'pageb88@gmail.com',
    subject: 'Goodbye!',
    text: `Goodbye, ${name}.`
  });
}

module.exports = {
  sendWelcomeEmail,
  sendGoodByeEmail
}