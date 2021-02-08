const databaseService = new (require("../Services/DatabaseService"))();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = class RegistrationController {
  signup = async (req, res) => {
    var { name, email, password, phoneNumber, otp } = req.body;
    if (!name || !email || !password || !phoneNumber || !otp) {
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

    if (parseInt(isOtpExist[0].otp) != parseInt(otp)) {
      console.log(arseInt(isOtpExist[0].otp), parseInt(otp));
      res.send({ message: "invalid otp" });
      return;
    }

    databaseService.deleteOtp(phoneNumber, email);

    var salt = await bcrypt.genSalt(process.env.SALTROUNDS);
    var hashedPassword = await bcrypt.hash(password, salt);

    var userID = process.env.USERID;

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
        number: number,
        email: email,
        id: userID,
      },
      process.env.PRIVATE_KEY
    );

    res.send({ message: "done", token });
  };

  login = async (req, res) => {
    var { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.send({ message: "failed" });
    }

    var isUserExist = await databaseService.getUserWithEmailOrPhoneNumber(
      number,
      email
    );

    console.log("user = ", isUserExist);

    if (!isUserExist) {
      res.send({ message: "user not exist" });
      return;
    }

    var { password, name, number, email, id } = req.body;
    var token = jwt.sign(
      {
        name: name,
        number: number,
        email: email,
        id: id,
      },
      process.env.PRIVATE_KEY
    );

    res.send({ message: "done", token });
  };
};
