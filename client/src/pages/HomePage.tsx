import { createSignal, type Component } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { Client } from "../Client";

import global from "../global";
import { generateRandomUsername } from "../utils";
import joinCode from "../joinCode";
import { showErrorPopover } from "../popovers";

type Option = "host" | "join";

const HomePage: Component = () => {
    const navigate = useNavigate();

    const [username, setUsername] = createSignal("");
    const [currentJoinCode, setCurrentJoinCode] = createSignal(joinCode());

    const [option, setOption] = createSignal<Option>(joinCode() ? "join" : "host");

    const joinGame = async (gameID: string) => {
        const game = await Client.joinGame(gameID, username().length === 0 ? generateRandomUsername() : username());
        global.setGameState(game);
        navigate(`/game/${gameID}`);
    }

    return <>
        <h1 class="text-center font-bold text-[4rem] text-gray-900 mt-14 font-[Libertine]">
            Wiki-Lie
        </h1>
        <h2 class="text-center text-gray-800 italic">
            A party game about bullsh*tting
        </h2>

        <div class="flex justify-center">
            <div class="max-w-sm mt-8 w-[90%] py-4 flex flex-col items-center border border-gray-400 rounded space-y-6">
                <div class="flex flex-row space-x-14">
                    <button class={`${option() === "host" && "font-bold text-gray-900 border-b border-gray-600"} text-gray-500 ${option() !== "host" && "hover:text-gray-600"} text-[1.05rem] drop-shadow transition`} onClick={() => {
                        setOption("host");
                    }}>
                        Host Game
                    </button>
                    <button class={`${option() === "join" && "font-bold text-gray-900 border-b border-gray-600"} text-gray-500 ${option() !== "join" && "hover:text-gray-600"} text-[1.05rem] drop-shadow transition`} onClick={() => {
                        setOption("join");
                    }}>
                        Join Game
                    </button>
                </div>
                <div class="space-y-2 flex flex-col items-center">
                    {
                        option() === "join" &&
                        <input class="rounded px-2 py-1 border border-gray-400 outline-none text-gray-900 shadow-lg shadow-gray-300 focus:border-teal-950 transition"  
                            placeholder="Join code"
                            onInput={e => {
                                const input = e.target.value.toUpperCase();
                                e.target.value = input;
                                if (input.length > 4 ||  !input.match(/^[A-Z0-9]*$/)) {
                                    e.target.value = input.substring(0, Math.min(4, input.length - 1));
                                    e.target.classList.add("input-error");
                                    setTimeout(() => { e.target.classList.remove("input-error") }, 200);
                                }
                                setCurrentJoinCode(e.target.value);
                            }}
                            value={currentJoinCode() || ""}
                        />
                    }
                    <input class="rounded px-2 py-1 border border-gray-400 outline-none text-gray-900 shadow-lg shadow-gray-300 focus:border-teal-950 transition" 
                        placeholder="Enter your name" 
                        onInput={e => {
                            const input = e.target.value;
                            if (input.length > 15 ||  !input.match(/^[a-zA-Z0-9]*$/)) {
                                e.target.value = input.substring(0, Math.min(15, input.length - 1));
                                e.target.classList.add("input-error");
                                setTimeout(() => { e.target.classList.remove("input-error") }, 200);
                            }
                            setUsername(e.target.value);
                        }} 
                    />
                </div>
                {
                    option() === "join" ?
                    <button class="menu-button" disabled={!currentJoinCode() || currentJoinCode()?.length as number < 4} onClick={async () => {
                        try {
                            // make a connection to the websocket and then create a game
                            await Client.connect();
                            await joinGame(currentJoinCode() as string);
                        }
                        catch (e: any) {
                            showErrorPopover(e.message as string);
                            console.log("Error ocurred", e);
                        }
                    }}>
                        Join
                    </button>
                    :
                    <button class="menu-button" onClick={async () => {
                        try {
                            // make a connection to the websocket and then create a game
                            await Client.connect();
                            const uid = await Client.createGame();
                            await joinGame(uid);
                        }
                        catch (e) {
                            console.log("Error ocurred", e);
                        }
                    }}>
                        Host
                    </button>
                }
            </div>
        </div>

        <div class="flex justify-center mt-12">
            <div class="max-w-md block mx-4 mt-12 px-10 py-3 border rounded border-gray-400 bg-gray-200">
                <h1 class="text-[1.5rem] font-bold text-center mb-2 font-[Libertine]">
                    How to Play
                </h1>
                <ol class="list-decimal text-gray-900 text-[0.9rem]">
                    <li>
                        A player is chosen as the judge
                    </li>
                    <li>
                        Each other player finds an obscure Wikipedia article
                    </li>
                    <li>
                        One of those articles is chosen at random
                    </li>
                    <li>
                        Each player tries to convince the judge they actually know what the chosen article is about
                    </li>
                </ol>
            </div>
        </div>

        <footer class="absolute bottom-0">
            
        </footer>
    </>
}

export default HomePage;