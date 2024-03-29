const nodemailer = require("nodemailer");


module.exports = class EmailService{
    myEmail = "rmart.admin@rajalakshmi.edu.in";
    myPassword = "RMart@2021";

     transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: this.myEmail,
          pass: this.myPassword,
        },
      });

      async sendMail(subject, text, toEmail) {
        var mailOptions = {
          from: `rMart <${this.myEmail}>`,
          to:   toEmail,
          subject: subject,
          html: text,
        };
      
        try {
          var result = await this.transporter.sendMail(mailOptions);
          console.log(result);
          return true;
        } catch (e) {
          console.log(e);
          return false;
        }
      }

      async sendMailWithImage(subject, text, toEmail,imagePath) {
        console.log(imagePath)
        var mailOptions = {
          from: `rMart <${this.myEmail}>`,
          to:   toEmail,
          subject: subject,
          html: text,
          attachments:[
            {   // file on disk as an attachment
              filename: 'QrCode.png',
              path: `../QrImages/${imagePath}` 
             },
          ]
        };
      
        try {
          var result = await this.transporter.sendMail(mailOptions);
          console.log(result);
          return true;
        } catch (e) {
          console.log(e);
          return false;
        }
      }
      

}