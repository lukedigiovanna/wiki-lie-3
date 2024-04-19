interface Player {
    id: string;
    username: string;
    points: 0;
    connected: false;
    selectedArticle: string | null;
}

interface Game {
    players: Player[];
    host: number;
    currentArticle: string | null;
    inRound: boolean;
}

export { Player, Game };