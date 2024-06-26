import { Component } from "solid-js";

import { GameProperty } from "../models";
import { Client } from "../Client";
import clientID from "../clientID";
import global from "../global";
import wikipedia from "../wikipedia";
import { resetArticleScroll } from "./ArticleDisplay";

const ArticleActionBar: Component<GameProperty> = (props: GameProperty) => {
    const game = () => props.game;
    const us = () => game().players.find(value => value.clientID === clientID);
    const hasSelectedArticle = () => us()?.selectedArticle !== null;
    const isGuesser = () => game().players.findIndex(value => value.clientID === clientID) === game().guesserIndex;

    const articleHasBeenUsed = () => game().history.find(summary => summary.article === global.article()?.title) !== undefined;

    return (
        <div class={`p-2 border ${hasSelectedArticle() ? "border-green-500" : "border-gray-300"} shadow rounded w-full space-x-4 flex flex-row justify-center sm:justify-start transition-all items-center`}>
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
                        resetArticleScroll();
                        global.setLoadingArticle(_ => true);
                        const randomArticle = await wikipedia.getRandomArticle();
                        global.setArticle(_ => randomArticle);
                        global.setLoadingArticle(_ => false);
                    }}>
                        New Article
                    </button>
                    <button disabled={global.article() === null || articleHasBeenUsed()} class="action-button" onClick={async () => {
                        Client.chooseArticle(game().uid, clientID, global.article()?.title as string);
                    }}>
                        Choose This
                    </button>
                </>
            }
            {
                isGuesser() && !articleHasBeenUsed() &&
                <p class="h-fit italic text-[0.7rem] text-gray-600">(this article won't be used this round)</p>
            }
            {
                articleHasBeenUsed() &&
                <p class="h-fit italic text-[0.7rem] text-gray-600">(you've already used this article, find another!)</p>
            }
        </div>
    )
}

export default ArticleActionBar;