import type { Command } from "../main";
import { PlayerSpawnAfterEvent, world } from "@minecraft/server";
export default {
    name: "lockdown",
    description: "Lockdown the server",
    requireOp: true,
    execute: () => {
        if (world?.lockdown) {
            delete world.lockdown;
            world.afterEvents.playerSpawn.unsubscribe(onPlayerJoin);
            return { status: 0, message: "§7[§aMatrix§7] §fServer is no longer locked down." };
        }
        world.lockdown = true;
        world.afterEvents.playerSpawn.subscribe(onPlayerJoin);
        return { status: 0, message: "§7[§aMatrix§7] §fServer is now locked down, new players except operator will be kicked." };
    },
} as Command;
function onPlayerJoin ({ player, initialSpawn }: PlayerSpawnAfterEvent) {
    if (!initialSpawn || player.isOp()) return;
    player.kick("Server is locked down by operator, please try again later");
}