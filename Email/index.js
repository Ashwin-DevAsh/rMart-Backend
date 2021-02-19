require("dotenv").config({ path: "./env/.env" });

const express = require("express");

const emailService = new (require('./Services/EmailService'))();

const bodyParser = require("body-parser");


const app = express();

app.use(helmet())

const cors = require("cors");

process.env.TZ = "Asia/Kolkata";

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.post('/sendMail',(req, res)=>{
   var {subject,body,to} = req.body
   emailService.sendMail(subject,body,to)
   res.send({message:'success'})
})

app.listen(8000, () => {
  console.log("connecte at port 8000");
});
