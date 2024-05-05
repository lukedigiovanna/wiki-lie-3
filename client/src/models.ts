import { Game } from "../../shared/models";

interface Article {
    title: string;
    html: string;
    saved?: boolean;
}

interface GameProperty {
    game: Game;
}

interface ArticleProperty {
    article: Article | null;
    blur: boolean;
    selected: boolean;
    loading: boolean;
}

export type { Article, GameProperty, ArticleProperty };