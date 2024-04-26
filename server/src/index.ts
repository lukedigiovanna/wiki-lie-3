import express from "express";
import { createServer } from "http";
import { join } from "path";
import { Socket, Server as SocketServer } from "socket.io";
import dotenv from "dotenv";

import { generateGameUID } from "./constants";
import { RedisGameClient } from "./RedisGameClient";

import { Game } from "../../shared/models";
import GameManager from "./GameManager";

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

const gameManager = new GameManager(io);

io.on("connection", (socket: Socket) => {
    console.log(socket.id, "connected");

    let _clientID: string | undefined = undefined;
    let _gameID: string | undefined = undefined;

    socket.on("disconnect", () => {
        console.log(socket.id, "disconnected");
        if (_gameID && _clientID) {
            gameManager.disconnectPlayer(_gameID, _clientID);
        }
    });

    socket.on("create-game", () => {
        const gameUID = gameManager.createGame();
        socket.emit("create-game-success", gameUID);
    });

    socket.on("join-game", (gameUID: string, clientID: string, username: string) => {
        try {
            const game = gameManager.joinGame(gameUID, socket.id, clientID, username);
            socket.join(gameUID); // join the room to get room updates
            _clientID = clientID;
            _gameID = gameUID;
            socket.emit("join-game-success", game);
        }
        catch (e: any) {
            console.log("join failure", e.message);
            socket.emit("join-game-failure", e.message);
        }
    });
});

server.listen(port, () => {
    console.log(`Started server on http://localhost:${port}`);
});

// redisClient.connect().then(() => {
//     // start the server after connecting to redis client
//     console.log("Connected to redis");
//     console.log("Starting server...");
//     server.listen(port, () => {
//         console.log(`Started server on http://localhost:${port}`);
//     });
// })
