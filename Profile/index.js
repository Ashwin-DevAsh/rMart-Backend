require("dotenv").config({ path: "./env/.env" });

const express = require("express");

const bodyParser = require("body-parser");

const regiseration = require("./Routes/registeration");

const otp = require("./Routes/otp");

const recovery = require("./Routes/recovery");

const merchants = require("./Routes/merchants");

var RateLimit = require('express-rate-limit');

var ipLookUp = new (require('./Services/iplookup'))();

var helmet = require('helmet')

const compression = require('compression')

const app = express();

app.use(compression())


var limiter = new RateLimit({
  windowMs: 5*60*1000, // 15 minutes 
  max: 120, // limit each IP to 100 requests per windowMs 
  delayMs: 0 // disable delaying - full speed until the max limit is reached 
});
 
app.enable('trust proxy');

app.use(limiter)

app.use(helmet())

app.use(ipLookUp.ipValidator)



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
