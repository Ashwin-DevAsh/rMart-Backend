require("dotenv").config({ path: "./env/.env" });

const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const { Pool } = require("pg");
const clientDetails = require("../Database/ClientDetails");

var pool = new Pool(clientDetails);

process.env.TZ = "Asia/Kolkata";

io.on("connection", (client) => {
  console.log(`Connected with ${client.id}`);
  client.on("getInformation", (data) => {
    try {
      var id = data["id"];
      client.join(id, (err) => {
        if (err) {
          console.log(err);
        }
      });
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

server.listen(7000, () => {
  console.log("Listing at 7000");
});

console.log("Last....");
