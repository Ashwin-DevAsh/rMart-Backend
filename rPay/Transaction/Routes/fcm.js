const FCM = require("fcm-node");
const clientDetails = require("../Database/ClientDetails");

const { Pool } = require("pg");
var pool = new Pool(clientDetails);

module.exports = async function sendNotificationToAll(userID, data) {
  var postgres = await pool.connect();
  var fcmToken = (
    await postgres.query("select fcmtoken from users where id = $1", [userID])
  ).rows[0].fcmtoken;
  await postgres.release();

  var serverKey = process.env.FCM_KEY;
  var fcm = new FCM(serverKey);

  console.log("serverkey = ", serverKey);
  console.log("fcmtoken = ", fcmToken);
  var message = {
    to: `AAAArC-htgw:APA91bEakTbYxGL6S6-Fd8D4FbOn08EoK-3nHOY6fuqqb1gPToQZPZE7q68-zlyUrRTCBnYeyMhesCRdhGiVyJmyBvZhtA6lcfSA4KZcpH66mu2ir28wz2sUw87kCXoZTKA6XVMRAg7H`,
    data: {
      type: data,
    },
  };
  fcm.send(message, function (err, response) {
    if (err) {
      console.log("Something has gone wrong!", err);
    } else {
      console.log("Successfully sent with response: ", response);
    }
  });
};
