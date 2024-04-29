// read cookie info or generate a new local cookie if there isn't one here

const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVXYZ1234567890";
function generateUniqueID() {
    let s = "";
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            s += alphabet[Math.floor(Math.random() * alphabet.length)];
        }
        if (i < 3) s += "-";
    }
    return s;
}

const CUID_IDENTIFIER = "_wiki-lie_cuid";

let clientID: string = window.localStorage.getItem(CUID_IDENTIFIER) || "";

if (clientID.length === 0) {
    clientID = generateUniqueID();
    console.log("generated new client id:", clientID);
    window.localStorage.setItem(CUID_IDENTIFIER, clientID); 
}

export default clientID;