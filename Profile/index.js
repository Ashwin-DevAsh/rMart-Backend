require("dotenv").config({ path: "./env/.env" });

const express = require("express");

const bodyParser = require("body-parser");

const regiseration = require("./Routes/registeration");

const otp = require("./Routes/otp");

const recovery = require("./Routes/recovery");

const merchants = require("./Routes/merchants");

const app = express();

const cors = require("cors");

process.env.TZ = "Asia/Kolkata";

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(regiseration);
app.use(otp);
app.use(recovery);
app.use(merchants);

app.listen(8000, () => {
  console.log("connecte at port 8000");
});
