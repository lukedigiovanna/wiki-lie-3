import { Component } from "solid-js";

import wikiLogo from "../assets/wiki-logo.png";

import { ArticleProperty } from "../models";
import ArticleTitle from "./ArticleTitle";

const ArticleDisplay: Component<ArticleProperty> = (props: ArticleProperty) => {
    const article = () => props.article;
    const blur = () => props.blur;

    return (
        <div class="border border-gray-300 shadow w-full h-[75vh] p-4 rounded overflow-y-scroll">    
            {
                article() ?
                <>
                    <ArticleTitle title={article()?.title as string} />
                    <div innerHTML={article()?.html} class="overflow-y-scroll"></div>
                </>
                :
                <div class={`${blur() && "blur-lg"} transition`}>
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