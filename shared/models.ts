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

export { Player, Game };