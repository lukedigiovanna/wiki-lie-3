
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVXYZ0123456789';
const CODE_LENGTH = 4;
function generateGameUID() {
    let s = "";
    for (let i = 0; i < CODE_LENGTH; i++) {
        s += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return s;
}

export { generateGameUID };