import type { Component } from "solid-js";

import { useParams } from "@solidjs/router";

const Game: Component = () => {
    const { id } = useParams();

    return <>
        <div class="block border-black w-full mx-auto sm:w-[75%] p-2 mt-2">
            <div class="flex flex-col-reverse sm:flex-row">
                <div class="flex-1 border border-gray-200 rounded p-2 flex flex-row justify-center space-x-8 sm:flex-col sm:justify-start sm:space-x-0">
                    <p class="font-bold">
                        Players: {1}/{3}
                    </p>
                    <p class="font-bold">
                        Ready: {0}/{0}
                    </p>
                </div>
                <div class="flex-[3] pl-0 sm:pl-10">
                    <h1 class="text-center sm:text-left text-[2.5rem] font-bold font-[Libertine]">
                        Wiki-Lie
                    </h1>
                </div>
            </div>
            <div class="flex sm:flex-row">
                <div>

                </div>
            </div>
        </div>
    </>
}

export default Game;