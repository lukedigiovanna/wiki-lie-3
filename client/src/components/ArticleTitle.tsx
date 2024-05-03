import { Component } from "solid-js";
import { getWikipediaURL } from "../wikipedia";

const ArticleTitle: Component<{title: string}> = (props: {title: string}) => {
    const title = () => props.title;
    
    const pre = () => {
        const pIdx = title().indexOf("(");
        if (pIdx < 0) {
            return title();
        }
        else {
            return title().substring(0, pIdx);
        }
    }

    const post = () => {
        const pIdx = title().indexOf("(");
        if (pIdx < 0) {
            return "";
        }
        else {
            return title().substring(pIdx);
        }
    }

    return (
        <a class="text-[2rem] font-wikipedia-title border-b-[#a2a9b1] p-1 hover:text-blue-900 text-gray-900 transition pointer-events-auto" href={getWikipediaURL(title())} title="open in wikipedia" target="_blank">
            {pre()}
            <span class="text-gray-600 text-[1.5rem] italic" title="This part is not visible to other players">
                {post()}
            </span>
        </a>
    )
}

export default ArticleTitle;