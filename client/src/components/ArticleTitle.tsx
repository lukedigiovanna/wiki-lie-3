import { Component } from "solid-js";

const ArticleTitle: Component<{title: string}> = (props: {title: string}) => {
    const title = () => props.title;
    
    const pIdx = title().indexOf("(");
    let pre: string, post: string = "";
    if (pIdx < 0) pre = title();
    else {
        pre = title().substring(0, pIdx);
        post = title().substring(pIdx);
    }

    return (
        <h1 class="text-[2rem] font-wikipedia-title border-b-[#a2a9b1] p-1">
            {title()}
            <span>

            </span>
        </h1>
    )
}

export default ArticleTitle;