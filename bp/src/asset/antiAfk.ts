import { Player } from "@minecraft/server";
import { addCheckInterval, removeCheckInterval } from "../util/tick";
export function antiAfkOn() {
    addCheckInterval("afk", tickEvent);
}
export function antiAfkOff() {
    removeCheckInterval("afk");
}
function tickEvent(player: Player) {
    const now = Date.now();
    player.lastMoved ??= now;
    const { x, y } = player.inputInfo.getMovementVector();
    if (x !== 0 || y !== 0) {
        player.lastMoved = now;
    } else if (now - player.lastMoved > 12000) {
    }
}
