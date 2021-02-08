const DatabaseService = require("../Services/DatabaseService");
const axios = require("axios");

module.exports = class OtpController {
  databaseService = new DatabaseService();

  getOtp = async (req, res) => {
    var { email, number } = req.body;
    if (!email && !password) {
      res.send({ message: "invalid body" });
    }

    var otpNumber = Math.floor(1000 + Math.random() * 9000);
    var apiKey = process.env.SMSKEY;

    // var smsbody = `<#>rMart never calls you asking for otp. Sharing it with
    //                  anyone gives them full access to your rMart account.
    //                  Your Login OTP is ${otpNumber} . ID: ${appId}`;

    var smsbody = `rMart never calls you asking for otp. Sharing it with
                     anyone gives them full access to your rMart account.
                     Your Login OTP is ${otpNumber}.`;

    console.log(smsbody);

    var isOptInserted = await this.databaseService.insertOtp(
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
};
