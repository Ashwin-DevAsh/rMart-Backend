class RegistrationController {
  signup = (req, res) => {
    var { name, email, password, phoneNumber, otp } = req.body;
    if (!name || !email || !password || !phoneNumber || !otp) {
      res.send({ message: "invalid body" });
      return;
    }
  };
}
