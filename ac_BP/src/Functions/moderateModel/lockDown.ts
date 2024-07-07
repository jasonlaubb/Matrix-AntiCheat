import { world } from "@minecraft/server";
import { isAdmin } from "../../Assets/Util";
import { Action } from "../../Assets/Action";

world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
    if (world.getDynamicProperty("lockdown") !== true || !initialSpawn || isAdmin(player)) return;
    Action.tempkick(player);
});
