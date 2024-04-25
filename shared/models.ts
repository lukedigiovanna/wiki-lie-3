interface Player {
    socketID: string;
    clientID: string;
    username: string;
    points: 0;
    selectedArticle: string | null;
    isConnected: boolean;
    isHost: boolean;
}

interface Game {
    uid: string;
    players: Player[];
    currentArticle: string | null;
    inRound: boolean;
    startedRoundTime: number | null;
}

export { Player, Game };