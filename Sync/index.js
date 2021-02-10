require("dotenv").config({ path: "./env/.env" });

const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const { Pool } = require("pg");
const clientDetails = require("../Database/ClientDetails");
const FCM = require("fcm-node");

var pool = new Pool(clientDetails);

process.env.TZ = "Asia/Kolkata";

io.on("connection", (client) => {
  client.on("getInformation", (data) => {
    try {
      var id = data["id"];
      client.join(id, (err) => {
        if (err) {
          console.log(err);
        }
      });
      // updateOnline(id, client.id);
    } catch (err) {
      console.log(err);
    }
  });

  client.on("notifySuccess", (data) => {
    io.to(data["to"]).emit("success");
  });

  client.on("notifyfailed", (data) => {
    io.to(data["to"]).emit("failed");
  });
});

async function updateOnline(martID, networkID) {
  var postgres = await pool.connect();
  var insertStatement = `INSERT INTO sync (networdID, martID) 
                          VALUES ($1,$2)
                        ON CONFLICT (martID) DO UPDATE
                       SET networdID = $1;`;
  try {
    await postgres.query(insertStatement, [networkID, martID]);
  } catch (e) {
    console.log(e);
    postgres.release();
  }
  postgres.release();
}

server.listen(7000, () => {
  console.log("Listing at 7000");
});

console.log("Last....");
