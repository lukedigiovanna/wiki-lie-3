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

export { generateRandomUsername };