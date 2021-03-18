const app = require("express").Router();
const clientDetails = require("../Database/ClientDetails");
var dateFormat = require("dateformat");
const { Pool } = require("pg");
var pool = new Pool(clientDetails);
var axios = require("axios");
var jwt = require("jsonwebtoken");
var sendNotification = require("./fcm");
const PaytmChecksum = require("paytmchecksum");
const Razorpay = require("razorpay");

//add money
app.post("/addMoney", async (req, res) => {
  var postgres = await pool.connect();
  await addMoney(postgres, req, res);
  await postgres.release();
});

async function addMoney(postgres, req, res) {
  var body = req.body;
  var amount = body.amount;
  var to = body.to;
  var from = body.from;

  if (!from || !amount || !to) {
    console.log("invalid body");
    res.send({ message: "failed" });
    return;
  }

  try {
    var decoded = await jwt.verify(req.get("token"), process.env.PRIVATE_KEY);
    if (decoded.id != to.id) {
      console.log(decoded.id, "!=", to.id);
      res.send({ message: "failed" });
      return;
    }
  } catch (e) {
    console.log(e);
    res.send({ message: "failed" });
    return;
  }

  var idExistBefore = (
    await postgres.query(
      `select * from transactions where isgenerated = true and cast(fromMetadata->>'id' as varchar) = $1`,
      [from.id]
    )
  ).rows;

  console.log(idExistBefore);

  if (idExistBefore.length != 0) {
    console.log("ID exist before");
    res.send({ message: "failed" });
    return;
  }

  if (from.name == "Upi transaction") {
    if (!(await verifyUPI(from.id, amount))) {
      console.log("Verification failed");
      res.send({ message: "failed" });
      return;
    }
  } else {
    console.log("Razorpay");
    if (!(await verifyGateway(from.id, amount))) {
      console.log("Verification failed");
      res.send({ message: "failed" });
      return;
    }
  }

  var toAmmount = await postgres.query(
    "select * from users where id=$1 for update",
    [to.id]
  );

  if (!toAmmount) {
    console.log("invalid user");
    res.send({ message: "failed" });
    return;
  }

  try {
    await postgres.query("begin");
    await postgres.query(
      "update users set balance = balance + $1 where id = $2",
      [amount, to.id]
    );
    var transactionTime = dateFormat(new Date(), "mm-dd-yyyy hh:MM:ss");
    var transactionID = (
      await postgres.query(
        `insert
     into transactions(
        transactionTime,
        fromMetadata,
        toMetadata,
        amount,
        isGenerated,
        iswithdraw)
      values($1,$2,$3,$4,$5,$6) returning transactionID`,
        [transactionTime, from, to, amount, true, false]
      )
    ).rows[0]["transactionid"];

    console.log(transactionID);

    var blockResult = await axios.post("http://block:9000/addMoneyBlock/", {
      transactionID: transactionID,
      from: from,
      to: to,
      isGenerated: true,
      isWithdraw: false,
      amount: amount,
    });
    if ((blockResult.data["message"] = "done")) {
      await postgres.query("commit");
      sendNotification(
        to.id,
        `addedMoney,${from.name},${from.id},${amount},${from.emal}`
      );
      res.send({ message: "done" });
    }
  } catch (e) {
    console.log(e);
    await postgres.query("rollback");
    res.send({ message: "failed" });
  }
}

async function verifyUPI(id, amount) {
  console.log(id);

  var paytmParams = {};
  paytmParams["MID"] = "bHQMqI37369900189801";
  paytmParams["ORDERID"] = id;
  var checksum = await PaytmChecksum.generateSignature(
    paytmParams,
    "pbzqsqeRWxcjTWGl"
  );
  paytmParams["CHECKSUMHASH"] = checksum;

  //   /* for Staging */
  //   // hostname: "securegw-stage.paytm.in",

  //   /* for Production */
  //   hostname: "securegw.paytm.in",

  try {
    var response = (
      await axios.post("https://securegw.paytm.in/order/status", paytmParams)
    ).data;
    console.log(response);
    return response.STATUS == "TXN_SUCCESS" && response.TXNAMOUNT == amount;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function verifyGateway(id, amount) {
  var instance = new Razorpay({
    key_id: "rzp_test_xkmYhXXE5iOTRu",
    key_secret: "4zU9jbEINKrwGFvGa0UBKN50",
  });

  try {
    var paymentDetails = await instance.payments.fetch(id);
    console.log("Payment Details = ", paymentDetails);
    console.log(
      id,
      paymentDetails.amount / 100,
      amount / 1 + 0.02 * amount,
      id
    );
    return (
      paymentDetails.status == "authorized" &&
      paymentDetails.amount / 100 == amount / 1 + 0.02 * amount
    );
  } catch (error) {
    return false;
  }
}

module.exports = app;
