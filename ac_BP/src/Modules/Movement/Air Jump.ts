import { Player, system } from "@minecraft/server";
import { c } from "../../Assets/Util";
import MathUtil from "../../Assets/MathUtil";
import { registerModule } from "../Modules";
import { isAdmin } from "../../Assets/Util";
const airJumpData = new Map<string, number[]>();
system.afterEvents.scriptEventReceive.subscribe((event) => {
    const config = c();
    if (event.id != "matrix:offhand" || !config.antiOffhand.enabled || !event.sourceEntity || !(event.sourceEntity instanceof Player) || isAdmin(event.sourceEntity)) return;
    const player = event.sourceEntity as Player;
    const data = airJumpData.get(player.id) ?? [] as number[];
    const v = player.getVelocity().y;
    if (data.length > config.antiAirJump.minDataRequired) {
        data.shift();
        const ratio = v / MathUtil.calculateDifferentSum(data);
        player.sendMessage(ratio.toString());
    }
})
registerModule("antiAirJump", false, [airJumpData]);