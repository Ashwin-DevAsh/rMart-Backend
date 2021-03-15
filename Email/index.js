require("dotenv").config({ path: "./env/.env" });

const express = require("express");

const emailService = new (require('./Services/EmailService'))();

const sendNotification = require('./Services/NotificationService')

const bodyParser = require("body-parser");


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


app.post('/sendMail',(req, res)=>{
   var {subject,body,to} = req.body
   console.log(subject,body,to)
   emailService.sendMail(subject,body,to)
   res.send({message:'success'})
})

app.post('/sendMailWithImage',(req, res)=>{
  var {subject,body,to,imageName} = req.body
  console.log(subject,body,to,imageName)
  emailService.sendMailWithImage(subject,body,to,imageName)
  res.send({message:'success'})
})

app.post('/sendNotification',(req, res)=>{
  var {title,subtitle,to,topic} = req.body
  sendNotification(title,subtitle,topic)
  res.send({message:'success'})
})

app.listen(8000, () => {
  console.log("connecte at port 8000");
});
