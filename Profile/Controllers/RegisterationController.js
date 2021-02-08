const databaseService = new (require("../Services/DatabaseService"))();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = class RegistrationController {
  signup = async (req, res) => {
    var { name, email, password, phoneNumber, otp, collegeID } = req.body;
    if (!name || !email || !password || !phoneNumber || !otp || !collegeID) {
      res.send({ message: "invalid body" });
      return;
    }

    var isUserExist = await databaseService.getUserWithEmailOrPhoneNumber(
      email,
      phoneNumber
    );

    console.log("existing User = ", isUserExist);

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

    console.log("otp = ", otp);

    databaseService.deleteOtp(phoneNumber, email);

    var salt = await bcrypt.genSalt(parseInt(process.env.SALTROUNDS));
    var hashedPassword = await bcrypt.hash(password, salt);

    var userID = process.env.USERID;

    var isUserInserted = await databaseService.insertUser(
      name,
      email,
      phoneNumber,
      userID,
      hashedPassword,
      collegeID
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
        id: userID,
        collegeID,
      },
      process.env.PRIVATE_KEY
    );

    res.send({ message: "done", token });
  };

  login = async (req, res) => {
    var { phoneNumber, email, password } = req.body;

    if (!phoneNumber || !email || !password) {
      res.send({ message: "failed" });
    }

    var isUserExist = await databaseService.getUserWithEmailOrPhoneNumber(
      phoneNumber,
      email
    );

    console.log("user = ", isUserExist);

    if (isUserExist.length == 0) {
      res.send({ message: "user not exist" });
      return;
    }

    var { password, name, number, email, id, collegeID } = req.body;
    var salt = await bcrypt.genSalt(parseInt(process.env.SALTROUNDS));
    var hashedPassword = await bcrypt.hash(password, salt);
    var isPasswordVerified = await bcrypt.compare(password, hashedPassword);

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

    res.send({ message: "done", token });
  };
};
