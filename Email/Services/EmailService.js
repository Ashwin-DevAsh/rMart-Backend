const nodemailer = require("nodemailer");


module.exports = class EmailService{
    myEmail = "rmart.admin@rajalakshmi.edu.in";
    myPassword = "RMart@2021";

     transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: myEmail,
          pass: myPassword,
        },
      });

      async sendMail(subject, text, toEmail) {
        var mailOptions = {
          from: myEmail,
          to: toEmail,
          subject: subject,
          html: text,
        };
      
        try {
          var result = await transporter.sendMail(mailOptions);
          console.log(result);
          return true;
        } catch (e) {
          console.log(e);
          return false;
        }
      }
      

}