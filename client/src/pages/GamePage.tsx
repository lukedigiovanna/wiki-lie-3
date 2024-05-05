import { onCleanup, type Component } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";

import { ErrorCode } from "../../../shared/models";

import { Client } from "../Client";
import GameView from "../components/GameView";
import global from "../global";
import clientID from "../clientID";
import wikipedia from "../wikipedia";
import { showErrorPopover } from "../popovers";
import { setJoinCode } from "../joinCode";

const GamePage: Component = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    const attemptRejoin = () => {
        Client.connect().then(() => {
            Client.rejoinGame(id).then((game) => {
                global.setGameState(game);
                const us = game.players.find(player => player.clientID === clientID);
                if (us?.selectedArticle) {
                    wikipedia.getArticle(us?.selectedArticle).then(article => {
                        global.setArticle(_ => article);
                    });
                }
            }).catch(err => {
                console.log("Rejoin failed", err);
                if (err.code === ErrorCode.REJOIN_FAILURE_ALREADY_CONNECTED) {
                    navigate("/");
                    showErrorPopover(err.message as string);
                }
                else if (err.code === ErrorCode.REJOIN_FAILURE_NEVER_CONNECTED) {
                    setJoinCode(id);
                    navigate(`/?join=${id}`);
                }
                else {
                    console.log("Unknown error occurred");
                    showErrorPopover(err.message as string);
                    navigate("/");
                }
            });
        }).catch(err => {
            console.log("Failed to establish socket connection", err);
            showErrorPopover("Failed to establish a connection to the server.");
            navigate("/");
        });
    }

    // if a client came directly to this page instead of from the homepage
    // if they connected from the home page then we would expect the client to be connected already
    // this primarily handles the case where a user refreshes their page or comes back to the URL
    if (!Client.isConnected) {
        // attempt to reconnect from this client
        attemptRejoin();
    }

    window.onfocus = () => {
        attemptRejoin();
    }

    onCleanup(() => {
        window.onfocus = () => {};
        Client.disconnect();
    });

    return <>
        {/* <div class="background"></div> */}
        <div class="block border-black w-full mx-auto lg:w-[75%] py-2 px-2 bg-[#eee] h-[100vh]">
            <div class="flex flex-row items-center">
                <h1 class="text-center sm:text-left text-[2.8rem] font-bold font-[Libertine] ml-4">
                    Wiki-Lie
                </h1>
                <button class="rounded border border-blue-700 ml-6 h-fit px-2 py-1 text-gray-900 text-[0.75rem] font-semibold bg-blue-100 hover:bg-blue-200 active:bg-blue-400 disabled:opacity-50 disabled:hover:bg-blue-100 disabled:active:bg-blue-100 disabled:cursor-auto transition" onClick={() => {
                    navigator.clipboard.writeText(`http://wiki-lie.xyz/?join=${id}`);
                }}>
                    Copy Join Link
                </button>
                <button class="rounded border border-red-700 ml-3 h-fit px-2 py-1 text-gray-900 text-[0.75rem] font-semibold bg-red-100 hover:bg-red-200 active:bg-red-400 disabled:opacity-50 disabled:hover:bg-red-100 disabled:active:bg-red-100 disabled:cursor-auto transition" onClick={() => {
                    const game = global.gameState();
                    if (game) {
                        Client.leaveGame(game.uid);
                    }
                    navigate("/");
                    setJoinCode(null);
                }} disabled={global.gameState()?.inRound}>
                    Abandon Game
                </button>
            </div>
            
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