const databaseService = new (require("../Services/DatabaseService"))();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");

module.exports = class RegistrationController {
  canLogin = async (req, res) => {
    var { phoneNumber, email } = req.body;

    if (!phoneNumber || !email) {
      res.send({ message: "invalid credientials" });
    }

    var isUserExist = await databaseService.getUserWithEmailOrPhoneNumber(
      email,
      phoneNumber
    );

    if (isUserExist.length == 0) {
      res.send({ message: "user not exist" });
      return;
    }

    res.send({ message: "done" });
  };

  signup = async (req, res) => {
    var { name, email, password, phoneNumber, otp } = req.body;
    if (!name || !email || !password || !phoneNumber || !otp) {
      res.send({ message: "invalid body" });
      return;
    }

    console.log("body = ", req.body);

    var isUserExist = await databaseService.getUserWithEmailOrPhoneNumber(
      email,
      phoneNumber
    );


    if (isUserExist.length != 0) {
      res.send({ message: "user already exist" });
      return;
    }

    var isOtpExist = await databaseService.getOtp(phoneNumber, email, otp);

    console.log(isOtpExist);
    if (isOtpExist.length == 0) {
      res.send({ message: "otp not verified" });
      return;
    }


    databaseService.deleteOtp(phoneNumber, email);

    var salt = await bcrypt.genSalt(parseInt(process.env.SALTROUNDS));
    var hashedPassword = await bcrypt.hash(password, salt);

    var userID = process.env.USERID + phoneNumber;

    var isUserInserted = await databaseService.insertUser(
      name,
      email,
      phoneNumber,
      userID,
      hashedPassword
    );

    if (!isUserInserted) {
      res.send({ message: "failed" });
      return;
    }

    var token = jwt.sign(
      {
        name: name,
        number: phoneNumber,
        email: email,
        id: userID
      },
      process.env.PRIVATE_KEY
    );

    try{
      axios.post('http://email:8000/sendMail',{
        subject:"New user",
        body:`<p>
              name ${name} <br/>
              email ${email} <br/>
              number ${phoneNumber} <br/>
             </p>`,
       to:'rmart.developers@rajalakshmi.edu.in'
      })
    }catch(e){
      console.log(e)
    }

    res.send({ message: "done", token });
  };

  login = async (req, res) => {
    var { phoneNumber, email, password } = req.body;

    var userEnteredPassword = password;

    if ((!phoneNumber && !email) || !password) {
      res.send({ message: "invalid credientials" });
    }

    var isUserExist = await databaseService.getUserWithEmailOrPhoneNumber(
      phoneNumber,
      email
    );


    if (isUserExist.length == 0) {
      res.send({ message: "user not exist" });
      return;
    }

    var { password, name, number, email, id, collegeID } = isUserExist[0];

    console.log(password, userEnteredPassword);

    var isPasswordVerified = bcrypt.compareSync(userEnteredPassword, password);

    console.log(isPasswordVerified);
    if (!isPasswordVerified) {
      res.send({ message: "invalid password" });
      return;
    }

    var token = jwt.sign(
      {
        name: name,
        number: number,
        email: email,
        id: id,
        collegeID,
      },
      process.env.PRIVATE_KEY
    );

    try{
      axios.post('http://email:8000/sendMail',{
        subject:"sign in",
        body:`<p>
              name ${name} <br/>
              email ${email} <br/>
              number ${number} <br/>
             </p>`,
       to:'rmart.developers@rajalakshmi.edu.in'
      })
    }catch(e){
      console.log(e)
    }

    res.send({ message: "done", token, user: isUserExist[0] });
  };
};
