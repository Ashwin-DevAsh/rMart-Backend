const databaseService = new (require("../Services/DatabaseService"))();
const axios = require("axios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = class RecoveryController {
  getRecoveryOtp = async (req, res) => {
    var { email, number } = req.body;
    console.log(req.body);
    if (!email || !number) {
      res.send({ message: "invalid body" });
      return;
    }

    await databaseService.deleteRecoveryOtp(number, email);

    var otpNumber = Math.floor(1000 + Math.random() * 9000);
    var apiKey = process.env.SMSKEY;
    var smsbody = `rMart never calls you asking for otp. Sharing it with
                     anyone gives them full access to your rMart account.
                     Your Login OTP is ${otpNumber}.`;

    console.log(smsbody);

    var isOptInserted = await databaseService.insertRecoveryOtp(
      number,
      email,
      otpNumber
    );

    if (!isOptInserted) {
      res.send({ message: "failed" });
      return;
    }

    await axios.post(
      `https://2factor.in/API/V1/${apiKey}/SMS/${number}/${otpNumber}`
    );

    res.send({ message: "done" });
  };

  verifyRecoveryOtp = async (req, res) => {
    var { email, number, otp } = req.body;
    console.log(req.body);
    if (!email || !number || !otp) {
      res.send({ message: "invalid body" });
      return;
    }

    var isOtpExist = await databaseService.getRecoveryOtp(number, email, otp);

    console.log(isOtpExist);
    if (isOtpExist.length == 0) {
      res.send({ message: "invalid otp" });
      return;
    }

    if (otp != isOtpExist[0].otp) {
      res.send({ message: "invalid otp" });
    }

    var isUpdated = await databaseService.updateRecoveryOtp(
      number,
      email,
      true
    );

    if (!isUpdated) {
      res.send({ message: "failed" });
      return;
    }

    res.send({ message: "done" });
  };

  changePassword = async (req, res) => {
    var { email, number, password } = req.body;
    console.log(req.body);
    if (!email || !number || !password) {
      res.send({ message: "invalid body" });
      return;
    }

    var isOtpExist = await databaseService.getVerifiedRecoveryOtp(
      number,
      email
    );

    console.log(isOtpExist);
    if (isOtpExist.length == 0) {
      console.log("otp not exist");
      res.send({ message: "Failed" });
      return;
    }

    var isUserExist = await databaseService.getUserWithEmailOrPhoneNumber(
      number,
      email
    );

    if (isUserExist.length == 0) {
      console.log("user not exist ", isUserExist);
      res.send({ message: "failed" });
      return;
    }

    databaseService.deleteRecoveryOtp(number, email);

    var salt = await bcrypt.genSalt(parseInt(process.env.SALTROUNDS));
    var hashedPassword = await bcrypt.hash(password, salt);

    var isPasswordUpdated = await databaseService.changePasswordForUser(
      email,
      number,
      hashedPassword
    );

    if (isPasswordUpdated.length == 0) {
      res.send({ message: "failed" });
      return;
    }

    res.send({ message: "done" });
  };
};
