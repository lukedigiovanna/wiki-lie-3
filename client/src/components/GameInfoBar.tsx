import { GameProperty } from "../models"

import { Component } from "solid-js"
import { countReadyPlayers } from "../utils";

const GameInfoBar: Component<GameProperty> = (props: GameProperty) => {
    const game = () => props.game;

    const numPlayers = () => game().players.length;
    const readyPlayers = () => countReadyPlayers(game());
    const necessaryReadyPlayers = () => Math.max(2, numPlayers() - 1);

    return (
        <div class="flex-1 border border-gray-400 bg-gray-200 shadow rounded p-2 flex flex-row justify-center space-x-16 mb-4 w-full">
            <p class="font-bold">
                Players: <span class={`${numPlayers() < 3 && "text-red-700"}`}>{numPlayers()}{game().players.length < 3 && "/3"}</span>
            </p>
            <p class="font-bold">
                Ready: <span class={`${readyPlayers() < necessaryReadyPlayers() && "text-red-700"}`}>{readyPlayers()}/{necessaryReadyPlayers()}</span>
            </p>
        </div>
    )
}

export default GameInfoBar;