import { Player, world } from "@minecraft/server";
import { isAdmin, isHost } from "./Util";
import { MatrixEvents } from "../Data/EnumData";
import { ban } from "../Functions/moderateModel/banHandler";

export class Action {
    private constructor () {};
    public static tempkick (player: Player) {
        if (isHost(player) || isAdmin(player)) return;
        player.triggerEvent(MatrixEvents.tempkick);
    }
    public static kick(player: Player, reason?: string, by?: string) {
        if (isHost(player) || isAdmin(player)) return;
        const textreason = "§c§lYou have been kicked\n§r§7Reason: §c" + reason ?? "--\n§7By: §c" + by ?? "--";
        world
            .getDimension(player.dimension.id)
            .runCommandAsync(`kick "${player.name}" ${textreason}`)
            .catch(() => player.triggerEvent(MatrixEvents.tempkick));
    }

    public static ban = ban;
}