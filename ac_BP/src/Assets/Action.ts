import { Player, world } from "@minecraft/server";
import { c, isAdmin, isHost } from "./Util";
import { MatrixEvents } from "../Data/EnumData";
import { ban, unban, unbanList, unbanRemove } from "../Functions/moderateModel/banHandler";
import { freeze, unfreeze } from "../Functions/moderateModel/freezeHandler";
let tempbans: { [key: string]: number } = {};
export class Action {
    private constructor() {}
    public static tempkick(player: Player) {
        if (isHost(player) || isAdmin(player)) return;
        player.triggerEvent(MatrixEvents.tempkick);
    }
    public static despawn(player: Player) {
        if (isHost(player) || isAdmin(player)) return;
        player.triggerEvent(MatrixEvents.tempkick);
        const playerId = player.id;
        world.afterEvents.playerSpawn.subscribe(({ player: { id }, initialSpawn }) => {
            if (!initialSpawn) return;
            if (playerId == id) player.triggerEvent(MatrixEvents.tempkick);
        })
    }
    public static tempban(player: Player) {
        if (isHost(player) || isAdmin(player)) return;
        const playerId = player.id;
        tempbans[playerId] = Date.now();
        const eventId = world.afterEvents.playerSpawn.subscribe(({ player: { id }, initialSpawn }) => {
            if (!initialSpawn || playerId != id) return;
            if (Date.now() - tempbans[playerId] > c().autoPunishment.tempBanLength) {
                world.afterEvents.playerSpawn.unsubscribe(eventId);
            } else {
                player.triggerEvent(MatrixEvents.tempkick);
            }
        })
        player.triggerEvent(MatrixEvents.tempkick);
    }
    public static kick(player: Player, reason?: string, by?: string) {
        if (isHost(player) || isAdmin(player)) return;
        const textreason = "§c§lYou have been kicked\n§r§7Reason: §c" + (reason ?? "--\n§7By: §c") + (by ?? "--");
        world
            .getDimension(player.dimension.id)
            .runCommandAsync(`kick "${player.name}" ${textreason}`)
            .catch(() => player.triggerEvent(MatrixEvents.tempkick));
    }
    public static mute(player: Player) {
        if (player.getDynamicProperty("mute")) return false;
        player.setDynamicProperty("mute", true);
        return true;
    }
    public static unmute(player: Player) {
        if (!player.getDynamicProperty("mute")) return false;
        player.setDynamicProperty("mute", false);
        return true;
    }
    public static freeze = freeze;
    public static unfreeze = unfreeze;
    public static ban = ban;
    public static unban = unban;
    public static unbanList = unbanList;
    public static unbanRemove = unbanRemove;
}
