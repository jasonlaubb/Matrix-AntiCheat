import { Player, world } from "@minecraft/server";
import { get } from "./database";
import { getPlayerRank } from "./util";
type PlayerIntervalList = { id: string; callback: (player: Player) => any }[];
const loopForEach: PlayerIntervalList = [];
const loopForCheck: PlayerIntervalList = [];
const loop: { id: string; callback: () => any }[] = [];

export function tick() {
    const players = world.getAllPlayers();
    const chatRankDisplayOnNameTag = get("chatRankDisplayOnNameTag");
    const format = get("chatRankNameTagFormat");
    players.forEach((player) => {
        loop.forEach((f) => f.callback());
        loopForEach.forEach((f) => f.callback(player));
        if (!player.isOp()) loopForCheck.forEach((f) => f.callback(player));
        if (chatRankDisplayOnNameTag) {
            const playerRank = getPlayerRank(player);
            player.nameTag = format.replace("{rank}", playerRank).replace("{player}", player.name);
        }
    });
}
export function addInterval(id: string, callback: () => any) {
    loop.push({ id, callback });
}
export function removeInterval(id: string) {
    const index = loop.findIndex(({ id: id2 }) => id2 === id);
    if (index !== -1) loop.splice(index, 1);
}
export function addPlayerInterval(id: string, callback: (player: Player) => any) {
    loopForEach.push({ id, callback });
}
export function removePlayerInterval(id: string) {
    const index = loopForEach.findIndex(({ id: id2 }) => id === id2);
    if (index !== -1) loopForEach.splice(index, 1);
}
export function addCheckInterval(id: string, callback: (player: Player) => any) {
    loopForCheck.push({ id, callback });
}
export function removeCheckInterval(id: string) {
    const index = loopForCheck.findIndex(({ id: id2 }) => id === id2);
    if (index !== -1) loopForCheck.splice(index, 1);
}
