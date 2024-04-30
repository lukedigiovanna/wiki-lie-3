import { Component, createSignal } from "solid-js";
import { GameProperty } from "../models";
import wikipedia from "../wikipedia";

import GameInfoBar from "./GameInfoBar";
import PlayerList from "./PlayerList";
import ArticleDisplay from "./ArticleDisplay";

import store from "../global";
import { Client } from "../Client";
import clientID from "../clientID";
import global from "../global";
import ArticleActionBar from "./ArticleActionBar";

const GameView: Component<GameProperty> = (props: GameProperty) => {
    console.log("Rerendering GameView");

    const game = () => props.game;
    const us = () => game().players.find(value => value.clientID === clientID);
    const hasSelectedArticle = () => us()?.selectedArticle !== null;

    const currentArticleTitle = () => game().players[game().currentArticlePlayerIndex].selectedArticle;

    return <>
        <GameInfoBar game={game()} />

        <div class="flex flex-col sm:flex-row">
            <PlayerList game={game()} />

            <div class="sm:ml-4 flex flex-col w-full space-y-4">
                {
                    game().inRound ?
                    <>
                        <div class="border-gray-300 border shadow w-full h-[35vh] p-4 rounded text-center">
                            <p class="text-gray-500 italic mt-10">
                                The article title is
                            </p>
                            <h1 class="font-[Libertine] text-[3rem] font-bold">
                                {currentArticleTitle()}
                            </h1>
                        </div>
                    </>
                    :
                    <>
                        <ArticleActionBar game={game()} />
        
                        <ArticleDisplay article={store.article()} blur={global.blurArticle()} selected={hasSelectedArticle()} />
                    </>

                }
            </div>
        </div>
    </>
}

export default GameView;