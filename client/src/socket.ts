import { io, Socket } from "socket.io-client";


class Client {
    private static current: Socket | undefined = undefined;

    static async connect() {
        return await new Promise<void>((resolve, reject) => {
            if (Client.current) { // if we somehow already have a connection
                Client.current.close(); // then close it
            }
            Client.current = io();
            Client.current.on('connect', () => {
                console.log('Successfully connected!');
                resolve();
            });
    
            Client.current.on('connect_error', (error) => {
                console.log('Connection failed:', error);
                reject(error);
            });
        });
    }

    static async createGame() {
        return await new Promise((resolve, reject) => {
            if (!Client.current) {
                reject("Cannot make a request without an active connection");
                return;
            }

            Client.current.emit("create-game");
            
            Client.current.on("create-game-success", (uid) => {
                resolve(uid);
            });

            Client.current.on("create-game-failure", (error) => {
                reject(error);
            });
        })
    }
}


export { Client };