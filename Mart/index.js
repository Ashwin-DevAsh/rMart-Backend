require("dotenv").config({ path: "./env/.env" });
const Auth = require("./Services/Auth");

const express = require("express");
const products = require("./Routes/products");
const orders = require("./Routes/orders");

const bodyParser = require("body-parser");
const uploadPictures = require("./Routes/productPictures");

const app = express();

const cors = require("cors");

const OrderExpery = require('./jobs/OrderExpery')

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

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use(new Auth().isAuthenticated);
app.use(products);
app.use(uploadPictures);

app.use(orders);

app.listen(4600, () => {
  console.log("connecte at port 4600");
});
