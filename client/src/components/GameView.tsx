import { Accessor, Component, For } from "solid-js";
import { GameProperty } from "../models";

import GameInfoBar from "./GameInfoBar";
import PlayerList from "./PlayerList";
import ArticleDisplay from "./ArticleDisplay";

import store from "../global";
import clientID from "../clientID";
import global from "../global";
import ArticleActionBar from "./ArticleActionBar";
import { Player } from "@shared/models";
import { Client } from "../Client";

const GameView: Component<GameProperty> = (props: GameProperty) => {
    const game = () => props.game;
    const us = () => game().players.find(value => value.clientID === clientID);
    const hasSelectedArticle = () => us()?.selectedArticle !== null;

    const currentArticleTitle = () => game().players[game().currentArticlePlayerIndex].selectedArticle;

    const ourIndex = () => game().players.findIndex(value => value.clientID === clientID);

    return <>
        <GameInfoBar game={game()} />


        <div class="flex flex-col sm:flex-row ">
            <PlayerList game={game()} />

            <div class="sm:ml-4 flex flex-col w-full space-y-4">
                {
                    game().inRound ?
                    <>
                        <div class="border-gray-300 border shadow w-full h-fit p-4 rounded text-center">
                            <p class="text-gray-500 italic mt-10">
                                The article title is
                            </p>
                            <h1 class="font-[Libertine] text-[3rem] font-bold mb-10">
                                {currentArticleTitle()}
                            </h1>
                        </div>
                        {
                            ourIndex() === game().guesserIndex &&
                            <div class="border-gray-300 border shadow w-full p-4 rounded text-center">
                                <p class="text-gray-600 italic mb-2">
                                    Who is telling the truth?
                                </p>
                                <div class="flex flex-row space-x-4 justify-center">
                                    <For each={game().players.filter((_, index) => index !== game().guesserIndex)} children={(player: Player, index: Accessor<number>) => {
                                        return (
                                            <button class="border border-gray-500 shadow px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 active:bg-gray-400 active:shadow-none transition font-bold text-[0.95rem]"
                                                onClick={() => {
                                                    Client.guessPlayer(game().uid, player.clientID);
                                                }}
                                            >
                                                {player.username}
                                            </button>
                                        )
                                    }} />
                                </div>
                            </div>
                        }
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