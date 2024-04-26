import { Game, Player } from "@shared/models";
import { Server as SocketServer } from "socket.io";
import { generateGameUID } from "./constants";

class GameManager {
    private games: Map<string, Game> = new Map<string, Game>();
    private io: SocketServer;

    constructor(io: SocketServer) {
        this.io = io;
    }

    private sendGameUpdate(gameUID: string) {
        const game = this.games.get(gameUID);
        if (!game) {
            throw Error("")
        }
        this.io.to(gameUID).emit("game-update", game);
    }

    createGame() {
        const gameUID = generateGameUID();

        const gameObject: Game = {
            uid: gameUID,
            currentArticle: null,
            startedRoundTime: null,
            inRound: false,
            players: []
        };

        this.games.set(gameUID, gameObject);

        return gameUID;
    }

    joinGame(gameUID: string, socketID: string, clientID: string, username: string) {
        const game = this.games.get(gameUID);
        if (!game) {
            throw Error("No game found with UID " + gameUID);
        }
        // check if this player is already in the game
        for (const player of game.players) {
            if (player.clientID === clientID) {
                player.isConnected = true;
                this.sendGameUpdate(gameUID);
                return game; // early return the game, allow the client to reconnect if they wish
            }
        }
        // create a new player with this client
        const newPlayer: Player = {
            clientID,
            points: 0,
            selectedArticle: null,
            username,
            isConnected: true,
            isHost: game.players.length === 0,
        };
        game.players.push(newPlayer);

        this.sendGameUpdate(gameUID);

        return game;
    }

    disconnectPlayer(gameID: string, clientID: string) {
        const game = this.games.get(gameID);

        if (!game) {
            throw Error("Game not found with id: " + gameID);
        }

        for (const player of game.players) {
            if (clientID === player.clientID) {
                player.isConnected = false;
                this.sendGameUpdate(gameID);
                return;
            }
        }
    }
}

export default GameManager;
