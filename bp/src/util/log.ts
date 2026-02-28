import { Vector3, world } from "@minecraft/server";
import { get } from "./database";
export function writeFlagLog(player: string, detection: string, type: string) {
    if (get("pauseFlagLog")) return;
    world.setDynamicProperty("log:flag:" + Date.now(), `${player};${detection};${type}`);
}
export function writeGateLog(player: string, join: boolean) {
    if (get("pauseJoinLeaveLog")) return;
    world.setDynamicProperty("log:gate:" + Date.now(), `${join};${player}`);
}
export function writeCommandLog(player: string, command: string) {
    if (get("pauseStaffCommandLog")) return;
    world.setDynamicProperty("log:cmd:" + Date.now(), `${player};${command}`);
}
function writeCommandBlockLog(player: string, place: boolean, commandblock: Vector3, dimension: string) {
    if (get("pauseCommandBlockLog")) return;
    world.setDynamicProperty("log:cmdbk:" + Date.now(), `${place};${Object.values(commandblock).join(",")};${dimension};${player}`);
}
world.afterEvents.playerPlaceBlock.subscribe(
    ({ player, block }) => {
        writeCommandBlockLog(player.name, true, block.location, block.dimension.id);
    },
    {
        blockTypes: ["minecraft:command_block", "minecraft:chain_command_block", "minecraft:repeating_command_block"],
    }
);
world.afterEvents.playerBreakBlock.subscribe(
    ({ player, block }) => {
        writeCommandBlockLog(player.name, false, block.location, block.dimension.id);
    },
    {
        blockTypes: ["minecraft:command_block", "minecraft:chain_command_block", "minecraft:repeating_command_block"],
    }
);
