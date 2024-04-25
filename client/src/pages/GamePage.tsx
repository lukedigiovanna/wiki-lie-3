import { createSignal, type Component } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";

import { Client } from "../Client";

import { Game, Player } from "@shared/models";
import { createStore } from "solid-js/store";

const GameView: Component<{game: Game}> = (props: {game: Game}) => {
    const game = () => props.game;
    
    return <>
        <div class="flex-1 border border-gray-200 rounded p-2 flex flex-row justify-center space-x-8 sm:flex-col sm:justify-start sm:space-x-0">
            <p class="font-bold">
                Players: {game().players.length}/{3}
            </p>
            <p class="font-bold">
                Ready: {0}/{0}
            </p>
            <p>
                Join link: http://localhost:3000/?join={game().uid}
            </p>
        </div>

        <div class="flex sm:flex-row">
            <div class="space-y-3">
                {
                    game().players.map((player: Player) => 
                    <div class="border border-gray-400 rounded px-20 text-center py-1">
                        <p class="text-center font-bold">
                            {player.username} 
                            {
                                !player.isConnected && 
                                <span class="text-red-500">
                                    (disconnected)
                                </span>
                            }
                        </p>
                        <p class="italic text-[0.9rem]">
                            points: {player.points}
                        </p>
                    </div>)
                }
            </div>
        </div>
    </>
}

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