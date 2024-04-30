import { Game, Player } from "@shared/models";

const adjectives = [
    "quick", "bright", "creative", 
    "sharp", "dynamic", "smooth", 
    "strong", "gentle", "vibrant", 
    "calm", "eager", "loyal"
];
const nouns = [
    "noodle", "wizard", "juggler", 
    "pirate", "ninja", "squirrel", 
    "dragon", "robot", "unicorn", 
    "potato"
];

function generateRandomUsername() {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    if (adjective.length + noun.length > 15) {
        return generateRandomUsername();
    } 
    return adjective + noun;
}

function countReadyPlayers(game: Game) {
    return game.players.filter((player: Player, index: number) => 
            player.selectedArticle !== null && index !== game.guesserIndex
    ).length;
}

function formatTimeMMSS(milliseconds: number) {
    const seconds = Math.floor(milliseconds / 1000) % 60;
    const minutes = Math.floor(milliseconds / 60000);
    const secondsDisplay = (seconds < 10 ? "0" : "") + (seconds % 60).toString();
    return `${minutes}:${secondsDisplay}`;
}

export { generateRandomUsername, countReadyPlayers, formatTimeMMSS };