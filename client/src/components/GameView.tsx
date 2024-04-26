import { Game, Player } from "@shared/models";
import { Component, createSignal } from "solid-js";
import { Article } from "../models";
import wikipedia from "../wikipedia";

import ArticleTitle from "./ArticleTitle";

import checkGIF from "../assets/check.gif";
import wikiLogo from "../assets/wiki-logo.png";
import readingGIF from "../assets/reading.gif";
import judgePNG from "../assets/judge.png";

import clientID from "../clientID";

const GameView: Component<{game: Game}> = (props: {game: Game}) => {
    const game = () => props.game;

    const [article, setArticle] = createSignal<Article | undefined>(undefined);

    return <>
        <div class="flex-1 border border-gray-400 bg-gray-200 shadow rounded p-2 flex flex-row justify-center space-x-16 mb-4">
            <p class="font-bold">
                Players: {game().players.length}{game().players.length < 3 && "/3"}
            </p>
            <p class="font-bold">
                Ready: {0}/{Math.max(2, game().players.length - 1)}
            </p>
        </div>

        <div class="flex sm:flex-row">
            <div class="space-y-3">
                {
                    game().players.map((player: Player, index: number) => 
                        <div class={`${player.clientID === clientID ? "border-2 border-gray-800" : "border border-gray-400"} rounded px-2 py-1 flex flex-row items-center`}>
                            <div class="w-12">
                                <p class="pl-2 text-[0.9rem]">
                                    #{player.rank}
                                </p>
                            </div>
                            <div class="text-center">
                                <p class="font-bold">
                                    {player.username} 
                                    {
                                        !player.isConnected && 
                                        <span class="text-red-500">
                                            (disconnected)
                                        </span>
                                    }
                                </p>
                                <p class="italic text-gray-700 text-[0.9rem]">
                                    points: {player.points}
                                </p>
                            </div>
                            <div class="w-12">
                                <img class="w-10 float-end" src={
                                    game().guesserIndex === index ?
                                        judgePNG
                                    : (player.selectedArticle ? checkGIF : readingGIF)
                                } />
                            </div>
                        </div>
                    )
                }
            </div>

            <div class="ml-4 flex flex-col w-full space-y-4">
                <div class="p-2 border border-gray-300 shadow rounded w-full space-x-4">
                    <button class="border border-gray-400 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 font-bold text-[0.95rem] px-2 py-1 rounded transition text-gray-800" onClick={async () => {
                        const randomArticle = await wikipedia.getRandomArticle();
                        setArticle(_ => randomArticle);
                    }}>
                        New Article
                    </button>
                    <button disabled={article() !== undefined} class="border border-gray-400 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 font-bold text-[0.95rem] px-2 py-1 rounded transition text-gray-800" onClick={async () => {
                        
                    }}>
                        Choose Article
                    </button>
                </div>

                <div class="border border-gray-300 shadow w-full h-[75vh] p-4 rounded overflow-y-scroll">    
                    {
                        article() ?
                        <>
                            <ArticleTitle title={article()?.title as string} />
                            <div innerHTML={article()?.html} class="overflow-y-scroll"></div>
                        </>
                        :
                        <div>
                            <p class="text-center font-[Libertine] text-[2.5rem] font-bold mb-8">
                                ~ The World Awaits ~
                            </p>
                            <img class="w-[50%] block mx-auto" src={wikiLogo} />
                        </div>
                    }
                </div>
            </div>
        </div>
        <p>
            Join link: http://localhost:3000/?join={game().uid}
        </p>
    </>
}

export default GameView;