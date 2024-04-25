import { Game } from "@shared/models";
import { Socket } from "socket.io";
import { generateGameUID } from "./constants";

class GameManager {
    private games: Map<string, Game> = new Map<string, Game>();
    private io: Socket;

    constructor(io: Socket) {
        this.io = io;
    }

    private sendStateUpdates(gameID: string) {
        const game = this.games.get(gameID);
        if (!game) {
            throw Error("")
        }
        this.io.to(gameID).emit("game-update", game);
    }

    createGame() {
        const gameUID = generateGameUID();

        const gameObject: Game = {
            uid: gameUID,
            currentArticle: null,
            host: 0,
            inRound: false,
            players: []
        };

        this.games.set(gameUID, gameObject);
    }

    joinGame(gameUID: string, clientID: string, username: string) {
        const game = this.games.get(gameUID);
        if (!game) {
            throw Error("No game found with UID " + gameUID);
        }
        // check if this player is already in the game
        for (const player of game.players) {
            if (player.id === clientID) {
                throw Error("You have already joined the game?? should this be an error?")
            }
        }
    }
}

// export default new GameManager();

