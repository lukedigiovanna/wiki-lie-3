import { createSignal, type Component } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";

import { Client } from "../Client";

import { Game } from "@shared/models";

import GameView from "../components/GameView";

const GamePage: Component = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    console.log("connecting to room with id", id);

    const [gameState, setGameState] = createSignal<Game | undefined>(undefined);

    const onGameUpdate = (game: Game) => {
        console.log(game);
        setGameState(c => game);
    }

    const joinGame = async () => {
        try {
            const game = await Client.joinGame(id, "username");
            Client.onGameUpdate(onGameUpdate);
            onGameUpdate(game);
            console.log("joined game", game);
        }
        catch (err) {
            console.log("Couldn't join game\n" + JSON.stringify(err));
            navigate("/");
        }
    }

    if (!Client.isConnected) {
        console.log("Oops, it looks like you aren't connected to the socket server, lets try again...")
        Client.connect().then(() => {
            joinGame();
        }).catch(err => {
            alert("Failed to establish socket connection\n" + err);
        })
    }
    else {
        joinGame();
    }

    return <>
        {/* <div class="background"></div> */}
        <div class="block border-black w-full mx-auto sm:w-[75%] py-2 px-14 bg-[#eee] h-[100vh]">
            <h1 class="text-center sm:text-left text-[2.8rem] font-bold font-[Libertine]">
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