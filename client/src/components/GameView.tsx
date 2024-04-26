import { Game, Player } from "@shared/models";
import { Component, createSignal } from "solid-js";
import { Article } from "../models";
import wikipedia from "../wikipedia";

import ArticleTitle from "./ArticleTitle";

const GameView: Component<{game: Game}> = (props: {game: Game}) => {
    const game = () => props.game;

    const [article, setArticle] = createSignal<Article | undefined>(undefined);

    return <>
        <div class="flex-1 border border-gray-400 bg-gray-300 rounded p-2 flex flex-row justify-center space-x-16 mb-4">
            <p class="font-bold">
                Players: {game().players.length}/{3}
            </p>
            <p class="font-bold">
                Ready: {0}/{Math.max(2, game().players.length - 1)}
            </p>
        </div>

        <div class="flex sm:flex-row">
            <div class="space-y-3">
                {
                    game().players.map((player: Player) => 
                    <div class="border border-gray-400 rounded px-20 text-center py-1">
                        <p class="text-center font-bold">
                            {player.username} 
                            {
                                !player.isConnected && 
                                <span class="text-red-500">
                                    (disconnected)
                                </span>
                            }
                        </p>
                        <p class="italic text-[0.9rem]">
                            points: {player.points}
                        </p>
                    </div>)
                }
            </div>

            <div class="ml-4 flex flex-col w-full space-y-4">
                <div class="p-2 border border-gray-400 rounded w-full">
                    <button class="action-button" onClick={async () => {
                        const randomArticle = await wikipedia.getRandomArticle();
                        setArticle(_ => randomArticle);
                    }}>
                        Random
                    </button>
                </div>

                <div class="border border-gray-400 w-full h-[75vh] p-4 rounded overflow-y-scroll">    
                    {
                        article() ?
                        <>
                            <ArticleTitle title={article()?.title as string} />
                            <div innerHTML={article()?.html} class="overflow-y-scroll"></div>
                        </>
                        :
                        <div>
                            The world awaits...
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