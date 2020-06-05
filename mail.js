// Allows to send emails, just as simple.

const nodemailer = require('nodemailer');

// information to establish smtp connexion
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'user@gmail.com',
    pass: 'password'
  }
});

// mail header options
let options = {
  from: 'example@gmail.com',
  to: 'example@gmail.com',
  subject: 'WatchDog IP',
  text: ''
};

/*  Send a mail 
*   param subject : subject of the mail
*   param content : mail body's content
*/
function send(subject, content){
    options.subject = subject;
    options.text = content;
    transporter.sendMail(options, function(error, info){
        if (error) {
            console.log("Error while sending the email");
          //console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      }); 
}


module.exports = {send}