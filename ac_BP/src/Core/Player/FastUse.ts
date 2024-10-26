import { Player, world } from "@minecraft/server";
import { configi, registerModule } from "../Modules";
import { DisableTags } from "../../Data/EnumData";
import flag from "../../Assets/flag";
import { Action } from "../../Assets/Action";

const lastItemUse = new Map<string, number>();

async function AntiFastUse(config: configi, player: Player) {
    const timeNow = Date.now();
    const timeLast = lastItemUse.get(player.id);
    lastItemUse.set(player.id, timeNow);
    if (timeLast === undefined) return;

    const delay = timeNow - timeLast;

    if (delay > 0 && delay < config.antiFastUse.minUseTime && !player.hasTag(DisableTags.item)) {
        //A - false positive: very low, efficiency: mid
        flag(player, config.antiFastUse.modules, "A");
        Action.timeout(player, config.antiFastUse.timeout);
    }
}

registerModule("antiFastUse", false, [lastItemUse], {
    worldSignal: world.afterEvents.itemUse,
    then: async (config, player) => AntiFastUse(config, player),
});
