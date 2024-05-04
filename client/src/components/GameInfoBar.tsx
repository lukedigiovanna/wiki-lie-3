import { GameProperty } from "../models"

import { Component, createEffect, createSignal, onCleanup } from "solid-js"
import { countReadyPlayers, formatTimeMMSS } from "../utils";
import clientID from "../clientID";
import { Client } from "../Client";

const GameInfoBar: Component<GameProperty> = (props: GameProperty) => {
    const game = () => props.game;

    const numPlayers = () => game().players.length;
    const readyPlayers = () => countReadyPlayers(game());
    const necessaryReadyPlayers = () => Math.max(2, numPlayers() - 1);
    const us = () => game().players.find(value => value.clientID === clientID);

    const ourIndex = () => game().players.findIndex(value => value.clientID === clientID);

    const [roundTimer, setRoundTimer] = createSignal(0);

    createEffect(() => {
        const intervalId = setInterval(() => {
          setRoundTimer(_ => new Date().getTime() - game().startedRoundTime);
        }, 100);
    
        // Cleanup function that clears the interval when the effect re-runs or the component unmounts
        onCleanup(() => clearInterval(intervalId));
    });

    return (
        <div class="flex-1 border border-gray-400 bg-gray-200 shadow rounded p-2 flex flex-row justify-center items-center space-x-8 sm:space-x-16 mb-4 w-full">
            {
                game().inRound ?
                <>
                    <p class="text-center font-bold text-blue-500 drop-shadow-md text-[1.05rem]">
                        {formatTimeMMSS(roundTimer())}
                    </p>
                </>
                :
                <>
                    <p class="font-bold text-center">
                        Players: <span class={`${numPlayers() < 3 && "text-red-700"}`}>{numPlayers()}{game().players.length < 3 && "/3"}</span>
                    </p>
                    {
                        readyPlayers() >= necessaryReadyPlayers() ?
                        (
                            game().guesserIndex === ourIndex() ?
                            <button class="bg-gradient-to-r from-blue-500 to-teal-500 text-gray-200 font-bold py-1 px-3 rounded inline-flex items-center animate-gradientBG hover:shadow-lg hover:text-gray-50 transition active:text-blue-300"
                                onClick={() => {
                                    Client.startRound(game().uid);
                                }}
                            >
                                Start Round
                            </button>
                            :
                            <p class="text-center font-bold text-blue-500 drop-shadow-md text-[1.05rem]">
                                Waiting for Judge...
                            </p>
                        )
                        :
                        (
                            ourIndex() !== game().guesserIndex ? 
                            (
                                !us()?.selectedArticle ?
                                <p class="text-center font-bold text-blue-500 drop-shadow-md text-[1.05rem]">
                                    Find an Article!
                                </p>
                                :
                                <p class="text-center font-bold text-blue-500 drop-shadow-md text-[1.05rem]">
                                    Waiting on Readers...
                                </p>
                            )
                            :
                            (
                                <p class="text-center font-bold text-blue-500 drop-shadow-md text-[1.05rem]">
                                    Waiting on Readers...
                                </p>
                            )
                        )
                    }
                    <p class="font-bold text-center">
                        Ready: <span class={`${readyPlayers() < necessaryReadyPlayers() && "text-red-700"}`}>{readyPlayers()}/{necessaryReadyPlayers()}</span>
                    </p>
                </>
            }
        </div>
    )
}

export default GameInfoBar;