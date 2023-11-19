import { Player, system, world } from "@minecraft/server";
import { isAdmin } from "../../Assets/Util";
import lang from "../../Data/Languages/lang";

function adminChat (player: Player, message: string) {
    if (!isAdmin(player)) return false
    if (player.getDynamicProperty("adminchat") === undefined) return false;

    system.run(() => world.getAllPlayers().filter(players => isAdmin(players)).forEach(players => players.sendMessage(`§c${lang(".AdminChat.adminchat")} §g${player.name}: §r${message}`)))
    return true
}

export { adminChat }