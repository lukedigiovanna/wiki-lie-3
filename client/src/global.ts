import { Article } from "./models";
import { generateRandomUsername } from "./utils";
import { createSignal } from "solid-js";

const [article, setArticle] = createSignal<Article | null>(null);
const [username, setUsername] = createSignal<string>(generateRandomUsername());

export default {
    article, setArticle, username, setUsername
};