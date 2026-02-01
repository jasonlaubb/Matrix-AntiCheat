import { Vector3, world } from "@minecraft/server";
export function writeFlagLog(player: string, detection: string, type: string) {
    world.setDynamicProperty("log:flag:" + Date.now(), `${player};${detection};${type}`);
}
export function writeGateLog(player: string, join: boolean) {
    world.setDynamicProperty("log:gate:" + Date.now(), `${join};${player}`);
}
export function writeCommandLog(player: string, command: string) {
    world.setDynamicProperty("log:cmd:" + Date.now(), `${player};${command}`);
}
export function writeCommandBlockLog(player: string, place: boolean, commandblock: Vector3, dimension: string) {
    world.setDynamicProperty("log:cmdbk:" + Date.now(), `${place};${Object.values(commandblock).join(",")};${dimension};${player}`);
}
