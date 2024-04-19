import express from "express";
import { createServer } from "http";
import { join } from "path";
import { Socket, Server as SocketServer } from "socket.io";

const port = 3000;

const app = express();
app.use(express.static(join(process.cwd(), "public_html")));

app.get('*', (req, res) => {
    res.sendFile(join(process.cwd(), 'public_html', 'index.html'));
});

const server = createServer(app);

const io = new SocketServer(server);

io.on("connection", (socket: Socket) => {
    socket.on("disconnect", () => {
        console.log(socket.id, "disconnected");
    });

    socket.on("register", (clientID: string) => {
        console.log("Client registered with ID: " + clientID);
    })
});

server.listen(port, () => {
    console.log(`Started server on http://localhost:${port}`);
});

