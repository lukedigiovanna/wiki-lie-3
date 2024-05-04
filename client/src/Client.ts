import { io, Socket } from "socket.io-client";
import clientID from "./clientID";

import { Game } from "../../shared/models";
import { Article } from "./models";
import global from "./global";
import { showRoundSummaryPopover } from "./popovers";

class Client {
    private static current: Socket | undefined = undefined;
    private static onGameUpdateCallback: ((game: Game) => void) | undefined = (game: Game) => {
        const currentGame = global.gameState();
        if (currentGame?.inRound && !game.inRound) {
            showRoundSummaryPopover(game.history[game.history.length - 1])
        }
        global.setGameState(_ => game);
    };

    static get isConnected() {
        return Client.current !== undefined;
    }

    static async connect() {
        return await new Promise<void>((resolve, reject) => {
            if (Client.current) { // if we somehow already have a connection
                Client.disconnect(); // then close it
            }

            Client.current = io({
                reconnection: true
            });

            Client.current.on('connect', () => {
                console.log('Successfully connected!');
                resolve();
            });
    
            Client.current.on('connect_error', (error) => {
                console.log('Connection failed:', error);
                Client.disconnect();
                reject(error);
            });

            Client.current.on('disconnect', () => {
                console.log("socket disconnected, a reconnection is necessary");
                Client.current = undefined;
            });
        });
    }

    static disconnect() {
        Client.current?.close();
    }

    static async createGame() {
        return await new Promise<string>((resolve, reject) => {
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

    static async rejoinGame(gameID: string) {
        return await new Promise<Game>((resolve, reject) => {
            if (!Client.current) {
                reject("Cannot make a request without an active connection");
                return;
            }

            Client.current.on("rejoin-game-success", (game) => {
                Client.current!.on("game-update", (game: Game) => {
                    if (Client.onGameUpdateCallback) {
                        Client.onGameUpdateCallback(game);
                    }
                })
                resolve(game as Game);
            });

            Client.current.on("rejoin-game-failure", (error) => {
                reject(error);
            });

            Client.current.emit("rejoin-game", gameID, clientID);
        });
    }

    static async leaveGame(gameID: string) {
        return await this.kickPlayer(gameID, clientID);
    }

    static async kickPlayer(gameID: string, playerID: string) {
        return await new Promise<void>((resolve, reject) => {
            if (!Client.current) {
                reject("Cannot make a request without an active connection");
                return;
            }

            Client.current.on("leave-game-success", () => {
                resolve();
            });

            Client.current.on("leave-game-failure", (error) => {
                reject(error);
            });

            Client.current.emit("leave-game", gameID, playerID);
        });
    }

    static async chooseArticle(gameID: string, playerID: string, articleTitle: string | null) {
        return await new Promise<void>((resolve, reject) => {
            if (!Client.current) {
                reject("Cannot make a request without an active connection");
                return;
            }

            Client.current.on("choose-article-success", () => {
                resolve();
            });

            Client.current.on("choose-article-failure", (error) => {
                reject(error);
            });

            Client.current.emit("choose-article", gameID, playerID, articleTitle);
        });
    }

    static async startRound(gameID: string) {
        return await new Promise<void>((resolve, reject) => {
            if (!Client.current) {
                reject("Cannot make a request without an active connection");
                return;
            }

            Client.current.on("start-round-success", () => {
                resolve();
            });

            Client.current.on("start-round-failure", (error) => {
                reject(error);
            });

            Client.current.emit("start-round", gameID);
        });
    }

    static async guessPlayer(gameID: string, guessClientID: string) {
        return await new Promise<void>((resolve, reject) => {
            if (!Client.current) {
                reject("Cannot make a request without an active connection");
                return;
            }

            Client.current.on("guess-player-success", () => {
                resolve();
            });

            Client.current.on("guess-player-failure", (error) => {
                reject(error);
            });

            Client.current.emit("guess-player", gameID, guessClientID);
        });
    }

    static saveCurrentArticle() {
        if (Client.current) {
            // just assume this works for now, no error checking on client. not a critical pathway
            const article = global.article();
            if (article) {
                Client.current.emit("save-article", article.title);
                article.saved = true;
                global.setArticle(_ => ({...article})); // trigger update on this article. 
            }
        }
    }
}


export { Client };