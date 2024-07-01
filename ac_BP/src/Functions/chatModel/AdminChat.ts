import { Player, system, world } from "@minecraft/server";
import { isAdmin, rawstr } from "../../Assets/Util";

function adminChat(player: Player, message: string) {
    if (!isAdmin(player)) return false;
    if (player.getDynamicProperty("adminchat") === undefined) return false;

    const players = world.getAllPlayers();
    system.run(() => players.filter((players) => isAdmin(players)).forEach((players) => players.sendMessage(new rawstr().str("§c").tra("adminchat.adminchat").str(`§g${player.name}: §r${message}`).parse())));
    return true;
}

export { adminChat };
