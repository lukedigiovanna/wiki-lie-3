import { GameProperty } from "../models"

import { Component } from "solid-js"

const GameInfoBar: Component<GameProperty> = (props: GameProperty) => {
    const game = () => props.game;

    return (
        <div class="flex-1 border border-gray-400 bg-gray-200 shadow rounded p-2 flex flex-row justify-center space-x-16 mb-4">
            <p class="font-bold">
                Players: {game().players.length}{game().players.length < 3 && "/3"}
            </p>
            <p class="font-bold">
                Ready: {0}/{Math.max(2, game().players.length - 1)}
            </p>
        </div>
    )
}

export default GameInfoBar;