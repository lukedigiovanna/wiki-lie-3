import type { Component } from "solid-js";

import { useParams } from "@solidjs/router";

const Game: Component = () => {
    const params = useParams();

    return <>
        <div>
            Game

            <p>id: {params.id}</p>
        </div>
    </>
}

export default Game;