import { Game } from "../../shared/models";

interface Article {
    title: string;
    html: string;
}

interface GameProperty {
    game: Game;
}

interface ArticleProperty {
    article: Article | null;
    blur: boolean;
}

export type { Article, GameProperty, ArticleProperty };