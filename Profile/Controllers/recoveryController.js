const databaseService = new (require("../Services/DatabaseService"))();

module.exports = class RecoveryController {
  getRecoveryOtp = (req, res) => {
   
    var { email, number } = req.body;
    console.log(req.body);
    if (!email || !number) {
      res.send({ message: "invalid body" });
      return;
    }

    await databaseService.deleteOtp(number, email);

    var otpNumber = Math.floor(1000 + Math.random() * 9000);
    var apiKey = process.env.SMSKEY;

    // var smsbody = `<#>rMart never calls you asking for otp. Sharing it with
    //                  anyone gives them full access to your rMart account.
    //                  Your Login OTP is ${otpNumber} . ID: ${appId}`;

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
};
