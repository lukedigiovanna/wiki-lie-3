import { Article } from "./models";
import { Game } from "../../shared/models";
import { createSignal } from "solid-js";

const [article, setArticle] = createSignal<Article | null>(null);
const [gameState, setGameState] = createSignal<Game | undefined>(undefined);

export default {
    article, setArticle, gameState, setGameState
};