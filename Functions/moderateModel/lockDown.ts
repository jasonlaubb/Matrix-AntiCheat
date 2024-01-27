import { world } from "@minecraft/server";
import { isAdmin, kick } from "../../Assets/Util";

world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
    if (world.getDynamicProperty("lockdown") !== true || !initialSpawn || isAdmin(player)) return;

    kick (player, "Lock down enabled", 'Matrix AntiCheat')
})
