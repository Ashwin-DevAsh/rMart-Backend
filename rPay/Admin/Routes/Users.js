const app = require("express").Router();
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
const clientDetails = require("../Database/ClientDetails");

var pool = new Pool(clientDetails);

app.get("/getUsers", async (req, res) => {
  var postgres = await pool.connect();
  await getUsers(postgres, req, res);
  await postgres.release();
});

app.get("/getMyTransactions/:id", async (req, res) => {
  var postgres = await pool.connect();
  await getMyTransactions(postgres, req, res);
  await postgres.release();
});

var getUsers = async (postgres, req, res) => {
  try {
    await jwt.verify(req.get("token"), process.env.PRIVATE_KEY);
  } catch (e) {
    console.log(e);
    res.send({ message: "failed" });
    return;
  }

  var users = (
    await postgres.query("select * from users where ismerchantaccount=false")
  ).rows;
  res.send(users);
};

var getMyTransactions = async (postgres, req, res) => {
  console.log("Getting Users");

  var id = req.params.id;
  if (!req.params.id) {
    res.send({ message: "err" });
  }

  try {
    var decoded = await jwt.verify(req.get("token"), process.env.PRIVATE_KEY);
  } catch (e) {
    console.log(e);
    res.send({ message: "failed" });
    return;
  }

  if (decoded.name) {
    postgres
      .query(
        `select * from transactions where cast(frommetadata->>'id' as varchar)=$1 or cast(tometadata->>'id' as varchar)=$1`,
        [id]
      )
      .then((datas) => {
        postgres
          .query(`select balance from users where id=$1`, [id])
          .then((myBalance) => {
            console.log(datas.rows[0]);
            res.send({ ...datas, balance: myBalance.rows[0].balance });
          })
          .catch((e) => {
            console.error(e.stack);
            res.send(e);
          });
      })
      .catch((e) => {
        console.error(e.stack);
        res.send(e);
      });
  }
};

module.exports = app;
