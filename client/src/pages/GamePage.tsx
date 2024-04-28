import { createSignal, type Component } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";

import { ErrorCode, Game } from "../../../shared/models";

import { Client } from "../Client";
import GameView from "../components/GameView";
import global from "../global";


const GamePage: Component = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    // if a client came directly to this page instead of from the homepage
    // if they connected from the home page then we would expect the client to be connected already
    // this primarily handles the case where a user refreshes their page or comes back to the URL
    if (!Client.isConnected) {
        // attempt to reconnect from this client
        Client.connect().then(() => {
            // 
            Client.rejoinGame(id).then((game) => {
                global.setGameState(game);
                Client.onGameUpdate(global.setGameState);
            }).catch(err => {
                console.log("Rejoin failed", err);
                if (err.code === ErrorCode.REJOIN_FAILURE_ALREADY_CONNECTED) {
                    alert("You are already connected to this game.")
                    navigate("/");
                }
                else if (err.code === ErrorCode.REJOIN_FAILURE_NEVER_CONNECTED) {
                    navigate(`/?join=${id}`);
                }
                else {
                    console.log("Unknown error occurred");
                    navigate("/");
                }
            });
        }).catch(err => {
            console.log("Failed to establish socket connection", err);
            navigate("/");
        });
    }
    
    window.onfocus = () => {
        // when we come back to this tab we should reestablish the connection
        // this handles a case such as a mobile client leaving their browser, 
        // causing the socket to disconnect, and then when they come back
        // we need to reestablish their connection
        // connectAndJoin();
    }

    return <>
        {/* <div class="background"></div> */}
        <div class="block border-black w-full mx-auto lg:w-[75%] py-2 px-2 bg-[#eee] h-[100vh]">
            <h1 class="text-center sm:text-left text-[2.8rem] font-bold font-[Libertine] ml-4">
                Wiki-Lie
            </h1>
            
            {
                (() => {
                    const game = global.gameState();
                    if (!game) {
                        return <>
                            Loading...
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