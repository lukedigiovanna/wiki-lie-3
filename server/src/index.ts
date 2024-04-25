import express from "express";
import { createServer } from "http";
import { join } from "path";
import { Socket, Server as SocketServer } from "socket.io";
import dotenv from "dotenv";

import { generateGameUID } from "./constants";
import { RedisGameClient } from "./RedisGameClient";

import { Game } from "../../shared/models";

// dotenv.config();

const port = 3000;

const app = express();
app.use(express.static(join(process.cwd(), "public_html")));

app.get('*', (req, res) => {
    res.sendFile(join(process.cwd(), 'public_html', 'index.html'));
});

const server = createServer(app);

// if (!process.env.REDIS_USERNAME) {
//     console.log("Did not find REDIS_USERNAME in .env file");
//     process.exit();
// }
// if (!process.env.REDIS_PASSWORD) {
//     console.log("Did not find REDIS_PASSWORD in .env file");
//     process.exit();
// }
// if (!process.env.REDIS_HOST) {
//     console.log("Did not find REDIS_HOST in .env file");
//     process.exit();
// }
// if (!process.env.REDIS_PORT) {
//     console.log("Did not find REDIS_PORT in .env file");
//     process.exit();
// }

// console.log(`REDIS CONFIG:
// "username": ${process.env.REDIS_USERNAME}
// "password": ${process.env.REDIS_PASSWORD}
// "host": ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}
// `)

// const redisClient = new RedisGameClient(
//     process.env.REDIS_USERNAME,
//     process.env.REDIS_PASSWORD,
//     process.env.REDIS_HOST,
//     Number.parseInt(process.env.REDIS_PORT)
// );

const io = new SocketServer(server);

io.on("connection", (socket: Socket) => {
    socket.on("disconnect", () => {
        console.log(socket.id, "disconnected");
    });

    socket.on("create-game", async () => {
        
    });

    socket.on("join-game", (gameID: string, clientID, username: string) => {
        // check redis for the given gameID
        socket.emit("join-game-failure", `game with id ${gameID} does not exist`);
    });
});

redisClient.connect().then(() => {
    // start the server after connecting to redis client
    console.log("Connected to redis");
    console.log("Starting server...");
    server.listen(port, () => {
        console.log(`Started server on http://localhost:${port}`);
    });
})


