import axios, { AxiosInstance, AxiosRequestHeaders } from "axios";
import { Article } from "./models";

class WikipediaClient {
    private instance: AxiosInstance;
    private defaultHeaders = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    constructor() {
        this.instance = axios.create({
            baseURL: "https://en.wikipedia.org/w/api.php?",
            timeout: 5000
        });
    }

    private get(url: string, params?: any): Promise<any> {
        return this.instance.get(url, { headers: this.defaultHeaders, params});
    }

    async getArticle(pageTitle: string): Promise<Article> {
        const result = await this.get("", {
            action: 'parse', 
            format: 'json', 
            page: pageTitle, 
            origin: '*'
        });
        
        return {
            title: result.data.parse.title, 
            html: result.data.parse.text['*']
        };
    }
    
    async getRandomArticle(): Promise<Article> {
        const articleTitleResponse = await this.get("", {
            action: "query", 
            format: 'json', 
            list: 'random', 
            rnnamespace: 0, 
            origin: '*'
        });
        const articleTitle = articleTitleResponse.data.query.random[0].title;
        return await this.getArticle(articleTitle);
    }
}

export default new WikipediaClient();