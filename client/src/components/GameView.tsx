import { Component, createSignal } from "solid-js";
import { GameProperty } from "../models";
import wikipedia from "../wikipedia";

import GameInfoBar from "./GameInfoBar";
import PlayerList from "./PlayerList";
import ArticleDisplay from "./ArticleDisplay";

import store from "../global";
import { Client } from "../Client";
import clientID from "../clientID";

const GameView: Component<GameProperty> = (props: GameProperty) => {
    console.log("Rerendering GameView");

    const game = () => props.game;
    const us = () => game().players.find(value => value.clientID === clientID);

    const [blurArticle, setBlurArticle] = createSignal(false);

    return <>
        <GameInfoBar game={game()} />

        <div class="flex flex-col sm:flex-row">
            <PlayerList game={game()} />

            <div class="sm:ml-4 flex flex-col w-full space-y-4">
                <div class="p-2 border border-gray-300 shadow rounded w-full space-x-4 flex flex-row justify-center sm:justify-start">
                    {
                        us()?.selectedArticle ?
                        <>
                            <button class="action-button" onClick={async () => {
                                Client.chooseArticle(game().uid, clientID, null);
                            }}>
                                Deselect This
                            </button>
                            <button class="action-button" onClick={() => {
                                setBlurArticle(blur => !blur);
                            }}>
                                Blur Article
                            </button>
                        </>
                        :
                        <>
                            <button class="action-button" onClick={async () => {
                                const randomArticle = await wikipedia.getRandomArticle();
                                store.setArticle(_ => randomArticle);
                            }}>
                                New Article
                            </button>
                            <button disabled={store.article() === null} class="action-button" onClick={async () => {
                                Client.chooseArticle(game().uid, clientID, store.article()?.title as string);
                            }}>
                                Choose Article
                            </button>
                        </>
                    }
                </div>

                <ArticleDisplay article={store.article()} blur={blurArticle()} />
            </div>
        </div>
        <p>
            Join link: http://localhost:3000/?join={game().uid}
        </p>
    </>
}

export default GameView;