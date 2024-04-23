import type { Component } from "solid-js";

import { useParams } from "@solidjs/router";

import { io } from "socket.io-client";

const Game: Component = () => {
    const { id } = useParams();

    // connect a socket client
    const client = io();

    client.emit("register", "slut");

    return <>
        <div>
            Game

            <p>id: {id}</p>
        </div>
    </>
}

export default Game;