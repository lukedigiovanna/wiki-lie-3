import { Game } from "@shared/models";
import { createClient } from "redis";
import { Socket } from "socket.io";

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
    
    async createGame(gameUID: string, value: Game) {
        await this.client.json.set(gameUID, "$", value as any);
        await this.client.publish(gameUID, "updated-game");
    }

    // async addPlayerToGame(gameUID, )

    // async subscribeSocket(socket: Socket, gameUID: string) {
    //     this.client.subscribe(gameUID, (message: string) => {

    //     });
    // }

}

export { RedisGameClient };