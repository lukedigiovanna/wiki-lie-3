import { Component } from "solid-js";

import { GameProperty } from "../models";
import { Player } from "../../../shared/models";
import clientID from "../clientID";
import { Client } from "../Client";

import checkGIF from "../assets/check.gif";
import readingGIF from "../assets/reading.gif";
import judgePNG from "../assets/judge.png";
import disconnectedPNG from "../assets/disconnected.png";
import crownPNG from "../assets/crown.png";

function getRankColorClass(rank: number) {
    if (rank === 1) {
        return "text-[#FFB302]";
    }
    if (rank === 2) {
        return "text-[#c0c0c0]";
    }
    if (rank === 3) {
        return "text-[#CD7F32]";
    }
    return "text-gray-700"
}

const PlayerList: Component<GameProperty> = (props: GameProperty) => {
    const game = () => props.game;

    const us = () => game().players.find(value => value.clientID === clientID);

    return (
        <div class="space-y-3 w-fit self-center sm:self-start mb-4">
            {
                game().players.map((player: Player, index: number) => 
                    <div class={`
                        transition relative rounded px-2 py-1 
                        ${(us()?.isHost && !player.isConnected) ? "cursor-pointer hover:border-red-500 hover:bg-red-200 active:bg-red-400" : "cursor-default"} 
                        ${player.clientID === us()?.clientID ? "border-2 border-gray-800" : "border border-gray-400"}
                    `} onClick={() => {
                        if (!player.isConnected && us()?.isHost) {
                            // kick this player
                            Client.kickPlayer(game().uid, player.clientID);
                        }
                    }}>
                        <div class={`flex flex-row items-center ${player.isConnected ? "opacity-100" : "opacity-50"}`}>
                            <div class="w-12">
                                <p class={`pl-2 ${getRankColorClass(player.rank)} text-[0.9rem] italic ${player.rank <= 3 && "font-bold drop-shadow-md text-[1rem]"}`}>
                                    #{player.rank}
                                </p>
                            </div>
                            <div class="text-center w-28">
                                <p class="font-bold text-[0.95rem]">
                                    {player.username} 
                                </p>
                                <p class="italic text-gray-700 text-[0.9rem]">
                                    points: {player.points}
                                </p>
                            </div>
                            <div class="w-12 flex justify-center">
                                <img class={`${game().guesserIndex !== index && player.selectedArticle ? "w-6" : "w-10"} float-end`} src={
                                    game().guesserIndex === index ?
                                        judgePNG
                                    : (player.selectedArticle ? checkGIF : readingGIF)
                                } />
                            </div>

                            {
                                player.isHost &&
                                <img src={crownPNG} class="absolute right-[-1.2rem] top-[-1.4rem] w-10 rotate-[30deg]" />
                            }
                        </div>

                        {
                            !player.isConnected &&
                            <img src={disconnectedPNG} class="absolute top-[50%] left-[50%] transform-center w-12 opacity-85" />
                        }
                    </div>
                )
            }
        </div>
    )
}

export default PlayerList;