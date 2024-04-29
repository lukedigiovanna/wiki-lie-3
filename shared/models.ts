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
    currentArticle: string | null;
    guesserIndex: 0;
    inRound: boolean;
    startedRoundTime: number | null;
}

enum ErrorCode {
    GAME_NOT_FOUND,
    JOIN_FAILURE_ALREADY_JOINED,
    REJOIN_FAILURE_ALREADY_CONNECTED,
    REJOIN_FAILURE_NEVER_CONNECTED,
    LEAVE_FAILURE_CLIENT_NOT_FOUND,
    CHOOSE_ARTICLE_CLIENT_NOT_FOUND
}

export type { Player, Game };

export { ErrorCode };