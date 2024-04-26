import { Game, Player } from "@shared/models";
import { Server as SocketServer } from "socket.io";
import { generateGameUID } from "./constants";

class GameManager {
    private games: Map<string, Game> = new Map<string, Game>();
    private io: SocketServer;

    constructor(io: SocketServer) {
        this.io = io;
    }

    private recalculatePlayerRanks(game: Game) {
        const players = [...game.players]; // shallow copy players to perform sorting
        players.sort((player1: Player, player2: Player) => player2.points - player1.points);
        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            if (i === 0) { // first player
                player.rank = 1;
            }
            else {
                const prevPlayer = players[i - 1];
                if (player.points === prevPlayer.points) {
                    player.rank = prevPlayer.rank; // players with same points should have same rank
                }
                else {
                    player.rank = prevPlayer.rank + 1;
                }
            }
        }
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
            guesserIndex: 0,
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
            points: Math.floor(Math.random() * 10),
            selectedArticle: null,
            username,
            isConnected: true,
            isHost: game.players.length === 0,
            rank: 0
        };
        game.players.push(newPlayer);

        this.recalculatePlayerRanks(game);

        this.sendGameUpdate(gameUID);

        return game;
    }

    // merely marks this player as "disconnected"
    // this then opens a pathway for a gamehost to kick the player
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
