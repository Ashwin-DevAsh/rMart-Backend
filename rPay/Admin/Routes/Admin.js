const app = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");
const clientDetails = require("../Database/ClientDetails");

var pool = new Pool(clientDetails);
app.post("/login", async (req, res) => {
  var postgres = await pool.connect();
  await login(postgres, req, res);
  postgres.release();
});

app.post("/addAdmin", async (req, res) => {
  var postgres = await pool.connect();
  await addAdmin(postgres, req, res);
  await postgres.release();
});

app.get("/getAdmins", async (req, res) => {
  var postgres = await pool.connect();
  await getAdmins(postgres, req, res);
  await postgres.release();
});

var getAdmins = async (postgres, req, res) => {
  try {
    var decoded = await jwt.verify(req.get("token"), process.env.PRIVATE_KEY);
  } catch (e) {
    console.log(e);
    res.send({ message: "failed" });
    return;
  }

  try {
    var users = (await postgres.query("select * from admins")).rows;
    res.send(users);
  } catch (err) {
    res.send({ err });
  }
};

var addAdmin = async (postgres, req, res) => {
  var admin = req.body;
  console.log(admin);
  if (!admin.name || !admin.email || !admin.number || !admin.password) {
    res.status(200).send([{ message: "error" }]);
    return;
  }
  var adminID = `radmin@${admin.number}`;

  try {
    var testadmin = (
      await postgres.query(
        "select * from admins where id = $1 or number = $2 or email = $3 ",
        [adminID, admin.number, admin.email]
      )
    ).rows;

    if (testadmin.length != 0) {
      res.json({ message: "Admin already exist" });
      return;
    }
    var hash = await bcrypt.hash(process.env.ROOT_ADMIN_PASSWORD, 10);

    await postgres.query(
      `insert into admins(name,number,email,password,permissions,id) values($1,$2,$3,$4,$5,$6)`,
      [
        admin.name,
        "91" + admin.number,
        admin.email,
        hash,
        [{ all: true }],
        adminID,
      ]
    );
    res.json({ message: "done" });
  } catch (err) {
    console.log(err);
    res.json({ message: "failed" });
  }
};

var login = async (postgres, req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  if (email && password) {
    var admin = (
      await postgres.query("select * from admins where email = $1", [email])
    ).rows;

    console.log(admin);

    if (admin.length == 0) {
      res.send({ message: "invalid admin" });
      return;
    }

    admin = admin[0];

    var name = admin.name;
    var number = admin.number;
    var permissions = admin.permissions;

    console.log(password, admin.password);
    bcrypt.compare(password, admin.password, async (err, isMatch) => {
      if (err) {
        console.log(err);
        res.send({ message: "error", err });
        return;
      }
      if (!isMatch) {
        res.send({ message: "invalid password" });
        return;
      }

      jwt.sign(
        { name, email, number, permissions },
        process.env.PRIVATE_KEY,
        { expiresIn: "1h" },
        (err, token) => {
          if (err) {
            console.log(err);
            res.send({ message: err });
          } else {
            res.send({
              message: "done",
              token,
              name,
              number,
              email,
              permissions,
            });
          }
        }
      );
    });
  } else {
    res.send({
      message: "missing username or password",
    });
  }
};

module.exports = app;
