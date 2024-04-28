import { Game, Player } from "@shared/models";
import { Component, createSignal } from "solid-js";
import { Article, GameProperty } from "../models";
import wikipedia from "../wikipedia";

import GameInfoBar from "./GameInfoBar";
import PlayerList from "./PlayerList";
import ArticleDisplay from "./ArticleDisplay";

const GameView: Component<GameProperty> = (props: GameProperty) => {
    const game = () => props.game;

    const [article, setArticle] = createSignal<Article | null>(null);

    return <>
        <GameInfoBar game={game()} />

        <div class="flex flex-col sm:flex-row">
            <PlayerList game={game()} />

            <div class="sm:ml-4 flex flex-col w-full space-y-4">
                <div class="p-2 border border-gray-300 shadow rounded w-full space-x-4 flex flex-row justify-center sm:justify-start">
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

                <ArticleDisplay article={article()} />
            </div>
        </div>
        <p>
            Join link: http://localhost:3000/?join={game().uid}
        </p>
    </>
}

export default GameView;