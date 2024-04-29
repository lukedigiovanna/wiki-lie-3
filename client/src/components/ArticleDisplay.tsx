import { Component } from "solid-js";

import wikiLogo from "../assets/wiki-logo.png";

import { ArticleProperty } from "../models";
import ArticleTitle from "./ArticleTitle";
import { Client } from "../Client";

import likeIcon from "../assets/like.png";

const ArticleDisplay: Component<ArticleProperty> = (props: ArticleProperty) => {
    const article = () => props.article;
    const blur = () => props.blur;
    const selected = () => props.selected;

    return (
        <div class={`${selected() ? "border-green-700" : "border-gray-300"} border shadow w-full h-[75vh] p-4 rounded overflow-y-scroll transition overflow-x-hidden`}>    
            {
                article() ?
                <div class={`${blur() && "blur-lg"} transition relative`}>
                    <div class="absolute right-0 top-0 flex space-x-2">
                        <button disabled={article()?.saved} class="border border-gray-800 shadow rounded disabled:opacity-50 active:bg-blue-300 hover:bg-blue-200 disabled:hover:bg-transparent transition" onClick={() => {
                            Client.saveCurrentArticle();
                        }}>
                            <img src={likeIcon} class="w-8" />
                        </button>
                    </div>
                    <ArticleTitle title={article()?.title as string} />
                    <div innerHTML={article()?.html} class="overflow-y-scroll"></div>
                </div>
                :
                <div>
                    <p class="text-center font-[Libertine] text-[2.5rem] font-bold mb-8">
                        ~ The World Awaits ~
                    </p>
                    <img class="w-[50%] block mx-auto" src={wikiLogo} />
                </div>
            }
        </div>
    )
}

export default ArticleDisplay;