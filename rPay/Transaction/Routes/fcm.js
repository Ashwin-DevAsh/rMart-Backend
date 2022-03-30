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
    to: `AAAAscgPzWY:APA91bGkRC3q7im6zEGNbDJSKHA2XTRXDW84VhFUNPAdW4U_9FOxGvghXAndZ7uzNZYroq04X2iBwsx3Agn34LT_zh1xJsQTguAHbjI1KnqmH0cHIrvF8hTed0_0oFgATWKxcxmqOfgx`,
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
