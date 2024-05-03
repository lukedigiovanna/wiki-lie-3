import { ErrorCode, Game, Player, RoundSummary } from "../../shared/models";
import { Server as SocketServer } from "socket.io";
import { generateGameUID } from "./constants";
import { AppError } from "./AppError";

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
            players: [],
            history: [],
            inRound: false,
            startedRoundTime: 0,
            guesserIndex: 0,
            currentArticlePlayerIndex: 0,
        };

        this.games.set(gameUID, gameObject);

        return gameUID;
    }

    joinGame(gameUID: string, clientID: string, username: string) {
        const game = this.games.get(gameUID);
        if (!game) {
            throw new AppError(ErrorCode.GAME_NOT_FOUND, "No game found with UID " + gameUID);
        }
        // check if this player is already in the game
        for (const player of game.players) {
            if (player.clientID === clientID) {
                throw new AppError(ErrorCode.JOIN_FAILURE_ALREADY_JOINED, "You have already joined this game!");
            }
        }

        if (game.inRound) {
            throw new AppError(ErrorCode.JOIN_FAILURE_GAME_IN_ROUND, "This game is currently in a round, you can join after they finish");
        }
        
        // create a new player with this client
        const newPlayer: Player = {
            clientID,
            points: 0,
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

    rejoinGame(gameUID: string, clientID: string) {
        const game = this.games.get(gameUID);
        if (!game) {
            throw new AppError(ErrorCode.GAME_NOT_FOUND, "No game found with UID " + gameUID);
        }
        for (const player of game.players) {
            if (player.clientID === clientID) {
                if (player.isConnected) {
                    throw new AppError(ErrorCode.REJOIN_FAILURE_ALREADY_CONNECTED, "You are already connected to this game!");
                }
                player.isConnected = true;
                
                this.sendGameUpdate(gameUID);

                return game;
            }
        }
        throw new AppError(ErrorCode.REJOIN_FAILURE_NEVER_CONNECTED, "Cannot rejoin a game which you have not joined!");
    }

    // merely marks this player as "disconnected"
    // this then opens a pathway for a gamehost to kick the player
    disconnectPlayer(gameID: string, clientID: string) {
        const game = this.games.get(gameID);

        if (!game) {
            throw new AppError(ErrorCode.GAME_NOT_FOUND, "Game not found with id: " + gameID);
        }

        for (const player of game.players) {
            if (clientID === player.clientID) {
                player.isConnected = false;
                this.sendGameUpdate(gameID);
                return;
            }
        }
    }

    leaveGame(gameID: string, clientID: string) {
        const game = this.games.get(gameID);

        if (!game) {
            throw new AppError(ErrorCode.GAME_NOT_FOUND, "Game not found with id: " + gameID);
        }

        const playerIndex = game.players.findIndex(player => player.clientID === clientID);
        if (playerIndex < 0) {
            throw new AppError(ErrorCode.LEAVE_FAILURE_CLIENT_NOT_FOUND, "Cannot leave game which player is not in");
        }

        // if a player left the game mid-round, then unfortunately we need to cancel the round.
        // ideally, players wouldn't do this.
        if (game.inRound) {
            const readerPlayer = game.players[game.currentArticlePlayerIndex];

            const summary: RoundSummary = {
                article: readerPlayer.selectedArticle as string,
                reader: readerPlayer.username,
                hadError: true
            };
            game.history.push(summary);

            readerPlayer.selectedArticle = null;

            game.inRound = false;
        }

        const player = game.players[playerIndex];
        if (player.isHost) {
            // find a new host, if available
            const nextIndex = (playerIndex + 1) % game.players.length;
            game.players[nextIndex].isHost = true;
        }

        if (playerIndex < game.guesserIndex) {
            game.guesserIndex--;
        }

        game.players.splice(playerIndex, 1);
        
        game.guesserIndex %= game.players.length;

        this.recalculatePlayerRanks(game);

        this.sendGameUpdate(gameID);
    }

    chooseArticle(gameID: string, clientID: string, articleTitle: string | null) {
        const game = this.games.get(gameID);

        if (!game) {
            throw new AppError(ErrorCode.GAME_NOT_FOUND, "Game not found with id: " + gameID);
        }

        const playerIndex = game.players.findIndex(player => player.clientID === clientID);
        if (playerIndex < 0) {
            throw new AppError(ErrorCode.CHOOSE_ARTICLE_CLIENT_NOT_FOUND, "Cannot choose an article for a player who is not in the game");
        }

        game.players[playerIndex].selectedArticle = articleTitle;

        this.sendGameUpdate(gameID);
    }

    startRound(gameID: string) {
        const game = this.games.get(gameID);

        if (!game) {
            throw new AppError(ErrorCode.GAME_NOT_FOUND, "Game not found with id: " + gameID);
        }

        if (game.inRound) {
            throw new AppError(ErrorCode.START_ROUND_ROUND_ALREADY_STARTED, "A round is already in progress, cannot start one now");
        }

        // check if a player somehow didn't choose an article
        for (let i = 0; i < game.players.length; i++) {
            if (i !== game.guesserIndex && game.players[i].selectedArticle === null) {
                throw new AppError(ErrorCode.START_ROUND_NOT_ALL_PLAYERS_CHOSE_ARTICLE, "Can't start a round unless all players have chosen an article");
            }
        }
        

        // choose a random player who isn't the guesser.
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * game.players.length);
        } while (randomIndex === game.guesserIndex);

        game.inRound = true;
        game.startedRoundTime = new Date().getTime();
        game.currentArticlePlayerIndex = randomIndex;

        this.sendGameUpdate(gameID);
    }

    guessPlayer(gameID: string, guessPlayerID: string) {
        const game = this.games.get(gameID);

        if (!game) {
            throw new AppError(ErrorCode.GAME_NOT_FOUND, "Game not found with id: " + gameID);
        }

        if (!game.inRound) {
            throw new AppError(ErrorCode.GUESS_PLAYER_NOT_IN_ROUND, "Cannot guess a player when not in a round");
        }

        const readerPlayer = game.players[game.currentArticlePlayerIndex];
        const guesserPlayer = game.players.find((_, index) => index === game.guesserIndex);
        const guessedPlayer = game.players.find((player) => player.clientID === guessPlayerID);

        if (!guessedPlayer) {
            throw new AppError(ErrorCode.GUESS_PLAYER_PLAYER_NOT_IN_GAME, "The player you are trying to guess is not in this game.");
        }

        if (!guesserPlayer) {
            throw new AppError(ErrorCode.GUESS_PLAYER_PLAYER_NOT_IN_GAME, "There's no guesser");
        }

        if (guessPlayerID === readerPlayer.clientID) {
            // the guesser chose the right player, +1 to each
            readerPlayer.points += 1;
            guesserPlayer.points += 1;
        }
        else {
            // guesser guessed wrong -- +2 to the foolower
            guessedPlayer.points += 2;
        }

        this.recalculatePlayerRanks(game);

        const summary: RoundSummary = {
            article: readerPlayer.selectedArticle as string,
            reader: readerPlayer.username,
            guesser: guesserPlayer.username,
            guessed: guessedPlayer.username,
            hadError: false,
        };

        game.history.push(summary);

        readerPlayer.selectedArticle = null;

        game.guesserIndex = (game.guesserIndex + 1) % game.players.length;

        game.inRound = false;

        this.sendGameUpdate(gameID);
    }
}

export default GameManager;
