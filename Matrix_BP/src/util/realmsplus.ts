import { Module } from "../matrixAPI";
import { world } from "@minecraft/server";
const botTag = "realmsplus";
/** @author NoVa Gh0ul */
export function outboundEvent (packet: any) {
        const cleanedPacket = JSON.stringify(packet).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
        world.getDimension("overworld").runCommandAsync(`tellraw @a[tag=${botTag}] {"rawtext":[{"text":"${cleanedPacket}"}]}`).catch((e) => {  });
}
export function useRealmsPlus () {
        return !Module.config.unfollowRealmsPunishment && world.getPlayers({ tags: [botTag] }).length > 0;
}
