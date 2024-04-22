import type { Component } from "solid-js";

const Home: Component = () => {
    return <>
        <h1 class="text-center font-bold text-[4rem] text-gray-900">
            Wiki-Lie
        </h1>
        <h2 class="text-center text-gray-800">
            A party game about bullsh*tting
        </h2>

        <div class="flex justify-center mt-8 space-x-6">
            <button class="action-button" popoverTarget="host-popover">
                Host
            </button>
            <button class="action-button" onClick={() => {
                console.log('join');
            }}>
                Join
            </button>
        </div>

        <div class="flex justify-center mt-12">
            <div class="max-w-md block mx-4 mt-12 px-10 py-3 border rounded border-gray-400 bg-gray-200">
                <h1 class="text-[1.5rem] font-bold text-center mb-2">
                    How to Play
                </h1>
                <ol class="list-decimal text-gray-900 text-[0.9rem]">
                    <li>
                        A player is chosen as the judge
                    </li>
                    <li>
                        Each other player finds a niche Wikipedia article
                    </li>
                    <li>
                        One of those articles is chosen at random
                    </li>
                    <li>
                        Each player tries to convince the judge they actually know what the chosen article is about
                    </li>
                </ol>
            </div>
        </div>

        <footer class="absolute bottom-0">
            
        </footer>
    </>
}

export default Home;