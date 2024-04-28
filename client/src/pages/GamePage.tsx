import { createSignal, type Component } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";

import { Client } from "../Client";
import { generateRandomUsername } from "../utils";

import { Game } from "@shared/models";

import GameView from "../components/GameView";

const GamePage: Component = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    const [gameState, setGameState] = createSignal<Game | undefined>(undefined);

    const onGameUpdate = (game: Game) => {
        setGameState(_ => game);
    }

    const joinGame = async () => {
        try {
            const game = await Client.joinGame(id, generateRandomUsername());
            Client.onGameUpdate(onGameUpdate);
            onGameUpdate(game);
            console.log("joined game", game);
        }
        catch (err) {
            console.log("Couldn't join game\n" + JSON.stringify(err));
            navigate("/");
        }
    }

    const connectAndJoin = () => {
        Client.connect().then(() => {
            joinGame();
        }).catch(err => {
            alert("Failed to establish socket connection\n" + err);
        })
    }

    if (!Client.isConnected) {
        connectAndJoin();
    }
    else {
        joinGame();
    }

    window.onfocus = () => {
        // when we come back to this tab we should reestablish the connection
        // this handles a case such as a mobile client leaving their browser, 
        // causing the socket to disconnect, and then when they come back
        // we need to reestablish their connection
        connectAndJoin();
    }

    return <>
        {/* <div class="background"></div> */}
        <div class="block border-black w-full mx-auto lg:w-[75%] py-2 px-2 bg-[#eee] h-[100vh]">
            <h1 class="text-center sm:text-left text-[2.8rem] font-bold font-[Libertine] ml-4">
                Wiki-Lie
            </h1>
            
            {
                (() => {
                    const game = gameState();
                    if (!game) {
                        return <>
                            
                        </>
                    }
                    else {
                        return <GameView game={game} />
                    }
                })()
            }
        </div>
    </>
}

export default GamePage;