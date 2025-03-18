import { Module } from "../matrixAPI";
import { world } from "@minecraft/server";
const botTag = "realmsplus";
export function outboundEvent (packet: any) {
        const cleanedPacket = JSON.stringify(packet).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
        world.getDimension("overworld").runCommandAsync(`tellraw @a[tag=${botTag}] {"rawtext":[{"text":"${cleanedPacket}"}]}`)
        .catch((e) => {  });
};
export function useRealmsPlus (
        return world.getPlayers({ tags: [botTag] }).length > 0;
};
