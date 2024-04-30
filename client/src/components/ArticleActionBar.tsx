import { Component } from "solid-js";

import { GameProperty } from "../models";
import { Client } from "../Client";
import clientID from "../clientID";
import global from "../global";
import wikipedia from "../wikipedia";

const ArticleActionBar: Component<GameProperty> = (props: GameProperty) => {
    const game = () => props.game;
    const us = () => game().players.find(value => value.clientID === clientID);
    const hasSelectedArticle = () => us()?.selectedArticle !== null;
    const isGuesser = () => game().players.findIndex(value => value.clientID === clientID) === game().guesserIndex;

    return (
        <div class={`p-2 border ${hasSelectedArticle() ? "border-green-700" : "border-gray-300"} shadow rounded w-full space-x-4 flex flex-row justify-center sm:justify-start transition-all items-center`}>
            {
                us()?.selectedArticle ?
                <>
                    <button class="action-button" onClick={async () => {
                        Client.chooseArticle(game().uid, clientID, null);
                        global.setBlurArticle(_ => false);
                    }}>
                        Deselect This
                    </button>
                    <button class="action-button" onClick={() => {
                        global.setBlurArticle(blur => !blur);
                    }}>
                        {global.blurArticle() ? "Unblur Article" : "Blur Article"}
                    </button>
                </>
                :
                <>
                    <button class="action-button" onClick={async () => {
                        const randomArticle = await wikipedia.getRandomArticle();
                        global.setArticle(_ => randomArticle);
                    }}>
                        New Article
                    </button>
                    <button disabled={global.article() === null} class="action-button" onClick={async () => {
                        Client.chooseArticle(game().uid, clientID, global.article()?.title as string);
                    }}>
                        Choose Article
                    </button>
                </>
            }
            {
                isGuesser() &&
                <p class="h-fit italic text-[0.7rem] text-gray-600">(this article won't be used this round)</p>
            }
        </div>
    )
}

export default ArticleActionBar;