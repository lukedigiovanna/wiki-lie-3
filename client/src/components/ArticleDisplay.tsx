import { Component, createEffect, createSignal, onMount } from "solid-js";

import wikiLogo from "../assets/wiki-logo.png";

import { ArticleProperty } from "../models";
import ArticleTitle from "./ArticleTitle";
import { Client } from "../Client";

import likeIcon from "../assets/like.png";

let articleScrollPos = 0;

function resetArticleScroll() {
    articleScrollPos = 0;
}

const ArticleDisplay: Component<ArticleProperty> = (props: ArticleProperty) => {
    const article = () => props.article;
    const blur = () => props.blur;
    const selected = () => props.selected;
    const loading = () => props.loading;

    return (
        <div ref={div => { 
            function setScroll() {
                div.scrollTop = articleScrollPos;
                if (div.scrollTop !== articleScrollPos) {
                    setTimeout(setScroll, 1);
                }
            }
            setScroll();
        }}

        onScroll={e=> {
            articleScrollPos = e.target.scrollTop;
        }} class={`${selected() ? "border-green-500" : "border-gray-300"} border shadow w-full h-[75vh] p-4 rounded overflow-y-scroll transition overflow-x-hidden cursor-default`}>
            <div class="pointer-events-none">
                {
                    loading() ?
                    <div class="flex flex-row h-full w-full items-center justify-center">
                        <div class="lds-ripple"><div></div><div></div></div>
                    </div>
                    :
                    article() ?
                    <div class={`${blur() && "blur-lg"} transition relative`}>
                        <div class="absolute right-0 top-0 flex space-x-2">
                            <button disabled={article()?.saved} class="border border-gray-800 shadow rounded disabled:opacity-50 active:bg-blue-300 hover:bg-blue-200 disabled:hover:bg-transparent transition pointer-events-auto" onClick={() => {
                                Client.saveCurrentArticle();
                            }}>
                                <img src={likeIcon} class="w-8" />
                            </button>
                        </div>
                        <ArticleTitle title={article()?.title as string} />
                        <div innerHTML={article()?.html}></div>
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
        </div>
    )
}

export default ArticleDisplay;

export { resetArticleScroll };
