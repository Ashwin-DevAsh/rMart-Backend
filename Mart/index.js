require("dotenv").config({ path: "./env/.env" });
const Auth = require("./Services/Auth");

const express = require("express");
const products = require("./Routes/products");
const orders = require("./Routes/orders");

const bodyParser = require("body-parser");
const uploadPictures = require("./Routes/productPictures");


var RateLimit = require('express-rate-limit');

const cors = require("cors");

const OrderExpery = require('./jobs/OrderExpery')

var helmet = require('helmet')

const app = express();

var limiter = new RateLimit({
  windowMs: 15*60*1000, // 15 minutes 
  max: 120, // limit each IP to 100 requests per windowMs 
  delayMs: 0 // disable delaying - full speed until the max limit is reached 
});

 
app.enable('trust proxy');

app.use(limiter)




// process.env.TZ = "Asia/Kolkata";

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};


try{
  OrderExpery.start()
}catch(e){
  console.log(e)
}

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
