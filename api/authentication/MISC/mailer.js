const nodemailer = require('nodemailer');
const config = require('../configuration/index');

var transport = nodemailer.createTransport({
  service: "Gmail",
//  port: 2525,
  auth: {
    user: "najikaikopasal@gmail.com",
    pass: "n@jik@iko12"
  }
});


module.exports = {
  sendEmail(from, to, subject, html){
    return new Promise((resolve, reject) => {
      transport.sendMail({from, subject, to, html},(err, info)=>{
        if(err) reject(err);

        resolve(info);
      });
    });
  }

}
