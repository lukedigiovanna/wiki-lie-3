import type { Component } from "solid-js";

import { useParams } from "@solidjs/router";

import { Client } from "../socket";

const Game: Component = () => {
    const { id } = useParams();

    console.log("connecting to room with id", id);

    const joinGame = async () => {
        try {
            await Client.joinGame(id, "username");
            console.log("joined game");
        }
        catch (err) {
            alert("Couldn't join game\n" + err);
        }
    }

    if (!Client.isConnected) {
        console.log("oops, it looks like you aren't connected to the room, lets try again...")
        Client.connect().then(() => {
            console.log("successfully reconnected");
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
            
            <div class="flex-1 border border-gray-200 rounded p-2 flex flex-row justify-center space-x-8 sm:flex-col sm:justify-start sm:space-x-0">
                <p class="font-bold">
                    Players: {1}/{3}
                </p>
                <p class="font-bold">
                    Ready: {0}/{0}
                </p>
            </div>

            <div class="flex sm:flex-row">
                <div>

                </div>
            </div>
        </div>
    </>
}

export default Game;