import { createSignal } from "solid-js";

function getCurrentJoinCode() {
    return new URLSearchParams(window.location.search).get("join");
}

const [joinCode, setJoinCode] = createSignal<string | null>(getCurrentJoinCode());
    
function updateJoinCode() {
    console.log("popstate event fired");
    setJoinCode(_ => getCurrentJoinCode())
}

window.addEventListener('popstate', updateJoinCode);

export default joinCode;

export { setJoinCode };