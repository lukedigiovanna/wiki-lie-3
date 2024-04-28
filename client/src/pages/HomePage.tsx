import { createSignal, type Component } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { useNavigate } from "@solidjs/router";
import { Client } from "../Client";

import global from "../global";
import { generateRandomUsername } from "../utils";

const HomePage: Component = () => {
    const [searchParams, _] = useSearchParams();

    const { join } = searchParams;

    const navigate = useNavigate();

    const [username, setUsername] = createSignal("");

    const joinGame = async (gameID: string) => {
        const game = await Client.joinGame(gameID, username().length === 0 ? generateRandomUsername() : username());
        global.setGameState(game);
        Client.onGameUpdate(global.setGameState);
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
            <div class="max-w-sm mt-8 w-[90%] py-4 flex flex-col items-center border border-gray-400 rounded">
                <input class="rounded px-2 py-1 border border-gray-400 outline-none text-gray-900 shadow-lg shadow-gray-300 focus:border-teal-950 transition" 
                    placeholder="Enter your name" 
                    onInput={e => {
                        const input = e.target.value;
                        if (input.length > 15 ||  !input.match(/^[a-zA-Z0-9]*$/)) {
                            e.target.value = input.substring(0, input.length - 1);
                            e.target.classList.add("input-error");
                            setTimeout(() => { e.target.classList.remove("input-error") }, 200);
                        }
                        setUsername(e.target.value);
                    }} 
                />

                <div class="flex justify-center mt-4 space-x-6">
                    {join ? 
                        <button class="action-button" onClick={async () => {
                            try {
                                // make a connection to the websocket and then create a game
                                await Client.connect();
                                await joinGame(join);
                            }
                            catch (e) {
                                console.log("Error ocurred", e);
                            }
                        }}>
                            Join
                        </button>
                    :   
                        <button class="action-button" onClick={async () => {
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
                        Each other player finds a niche Wikipedia article
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