module.exports = async function sendNotificationToAll(title, subtitle,topic) {

  
  var serverKey = process.env.FCM_KEY;
  var fcm = new FCM(serverKey);
  console.log(serverKey);
  var message = {
    to: `/topics/${topic}`,
    notification: {
        title: title, 
        body: subtitle
    },
  };
  fcm.send(message, function (err, response) {
    if (err) {
      console.log("Something has gone wrong!");
    } else {
      console.log("Successfully sent with response: ", response);
    }
  });
  };