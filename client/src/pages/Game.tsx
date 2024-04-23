import type { Component } from "solid-js";

import { useParams } from "@solidjs/router";

const Game: Component = () => {
    const { id } = useParams();

    return <>
        <div>
            Game

            <p>id: {id}</p>
        </div>
    </>
}

export default Game;