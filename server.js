const db = require("./firebase");
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

let playerCount = 0;

app.get("/", (req, res) => {

    res.send("DuckSystem API Online");

});

app.post("/updatePlayers", (req, res) => {

    playerCount = req.body.online;
    db.ref("network/playerCount").set(playerCount);

    console.log("Updated players:", playerCount);

    io.emit("playerCount", playerCount);

    res.sendStatus(200);

});

io.on("connection", (socket) => {

    console.log("Website connected");

    socket.emit("playerCount", playerCount);

});

server.listen(3000, () => {

    console.log("DuckSystem Backend Running");

});