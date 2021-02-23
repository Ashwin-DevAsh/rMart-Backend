require("dotenv").config({ path: "./env/.env" });

const express = require("express");
const products = require("./Routes/products");
const orders = require("./Routes/orders");

const bodyParser = require("body-parser");
const uploadPictures = require("./Routes/productPictures");

const compression = require('compression')


var RateLimit = require('express-rate-limit');

const cors = require("cors");



var helmet = require('helmet')

var ipLookUp = new (require('./Services/iplookup'))();

const app = express();

app.use(compression())

var limiter = new RateLimit({
  windowMs: 5*60*1000, // 15 minutes 
  max: 18000, // limit each IP to 100 requests per windowMs 
  delayMs: 0 // disable delaying - full speed until the max limit is reached 
});

 
app.enable('trust proxy');

app.use(limiter)

app.use(ipLookUp.ipValidator)

process.env.TZ = "Asia/Kolkata";

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

app.use(helmet())
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(products);
app.use(uploadPictures);

app.use(orders);

app.listen(4600, () => {
  console.log("connecte at port 4600");
});
