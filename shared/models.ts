interface Player {
    clientID: string;
    username: string;
    points: number;
    selectedArticle: string | null;
    isConnected: boolean;
    isHost: boolean;
    rank: number;
}

interface RoundSummary {
    article: string;
    reader: string; // username of the one who read the article
    guesser?: string;
    guessed?: string;
    hadError: boolean;
}

interface Game {
    uid: string;
    players: Player[];
    history: RoundSummary[];
    // round related fields
    inRound: boolean;
    startedRoundTime: number;
    guesserIndex: number;
    currentArticlePlayerIndex: number;
}

enum ErrorCode {
    GAME_NOT_FOUND,
    JOIN_FAILURE_ALREADY_JOINED,
    JOIN_FAILURE_GAME_IN_ROUND,
    REJOIN_FAILURE_ALREADY_CONNECTED,
    REJOIN_FAILURE_NEVER_CONNECTED,
    LEAVE_FAILURE_CLIENT_NOT_FOUND,
    CHOOSE_ARTICLE_CLIENT_NOT_FOUND,
    START_ROUND_ROUND_ALREADY_STARTED,
    START_ROUND_NOT_ALL_PLAYERS_CHOSE_ARTICLE,
    GUESS_PLAYER_NOT_IN_ROUND,
    GUESS_PLAYER_PLAYER_NOT_IN_GAME
}

export type { Player, Game, RoundSummary };

export { ErrorCode };