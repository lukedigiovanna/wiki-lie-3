interface Player {
    clientID: string;
    username: string;
    points: number;
    selectedArticle: string | null;
    isConnected: boolean;
    isHost: boolean;
    rank: number;
}

interface Game {
    uid: string;
    players: Player[];
    // round related fields
    inRound: boolean;
    startedRoundTime: number;
    guesserIndex: number;
    currentArticlePlayerIndex: number;
}

enum ErrorCode {
    GAME_NOT_FOUND,
    JOIN_FAILURE_ALREADY_JOINED,
    REJOIN_FAILURE_ALREADY_CONNECTED,
    REJOIN_FAILURE_NEVER_CONNECTED,
    LEAVE_FAILURE_CLIENT_NOT_FOUND,
    CHOOSE_ARTICLE_CLIENT_NOT_FOUND,
    START_ROUND_ROUND_ALREADY_STARTED,
    START_ROUND_NOT_ALL_PLAYERS_CHOSE_ARTICLE
}

export type { Player, Game };

export { ErrorCode };