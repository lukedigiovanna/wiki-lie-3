import { Game } from "@shared/models";
import { createClient } from "redis";

class RedisGameClient {
    private client;

    constructor(username: string, password: string, host: string, port: number) {
        this.client = createClient({
            username,
            password,
            socket: {
                host,
                port
            }
        })
    }

    async connect() {
        await this.client.connect();
    }

    async set(key: string, value: any) {
        await this.client.set(key, value);
    }
    
    async setGameData(gameUID: string, value: Game) {
        await this.client.json.set(gameUID, "$", value as any);
        await this.client.publish(gameUID, "updated-game");
    }

}

export { RedisGameClient };