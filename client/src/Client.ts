import { io, Socket } from "socket.io-client";
import clientID from "./clientID";

import { Game } from "@shared/models";

class Client {
    private static current: Socket | undefined = undefined;
    private static onGameUpdateCallback: ((game: Game) => void) | undefined = undefined;

    static get isConnected() {
        return Client.current !== undefined;
    }

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
            
            Client.current.on("create-game-success", (uid) => {
                resolve(uid);
            });

            Client.current.on("create-game-failure", (error) => {
                reject(error);
            });

            Client.current.emit("create-game");
        })
    }

    static async joinGame(gameID: string, username: string) {
        return await new Promise<Game>((resolve, reject) => {
            if (!Client.current) {
                reject("Cannot make a request without an active connection");
                return;
            }

            Client.current.on("join-game-success", (game) => {
                Client.current!.on("game-update", (game: Game) => {
                    if (Client.onGameUpdateCallback) {
                        Client.onGameUpdateCallback(game);
                    }
                })
                resolve(game as Game);
            });

            Client.current.on("join-game-failure", (error) => {
                reject(error);
            });

            console.log("attempting to join game");
            Client.current.emit("join-game", gameID, clientID, username);
        });
    }

    static onGameUpdate(callback: (game: Game) => void) {
        Client.onGameUpdateCallback = callback;
    }
}


export { Client };