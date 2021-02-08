require("dotenv").config({ path: "./env/.env" });

const express = require("express");

const bodyParser = require("body-parser");

const regiseration = require("./Routes/registeration");

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

app.listen(4600, () => {
  console.log("connecte at port 4600");
});
