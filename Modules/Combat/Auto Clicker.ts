import {
    world,
    system,
    Player
} from "@minecraft/server";
import config from "../../Data/Config.js";
import { flag, isAdmin } from "../../Assets/Util.js";
import lang from "../../Data/Languages/lang.js";

interface ClickData {
    clicks: number[]
}

const clickData: Map<string, ClickData> = new Map<string, ClickData>();

/**
 * @author ravriv
 * @description This checks if the player is clicking more than 22 times per second.
 */

async function AutoClicker (player: Player) {
    const currentTime: number = Date.now();
    const { id } = player;
    const { clicks } = clickData.get(id) || { clicks: [] };

    //filter the clicks that are older than 1.5 seconds
    const filteredClicks: number[] = clicks.filter(clickTime => currentTime - clickTime < 1500);
    filteredClicks.push(currentTime);

    //constant the clicks per second
    const cps: number = filteredClicks.length;

    //if the clicks per second is higher than the max clicks per second, flag the player
    if (!player.hasTag("matrix:pvp-disabled") && cps > config.antiAutoClicker.maxClicksPerSecond) {
        flag (player, 'Auto Clicker', "A", config.antiAutoClicker.maxVL,config.antiAutoClicker.punishment, [`${lang(">Click Per Second")}:${cps.toFixed(0)}`])
        player.applyDamage(6);
        player.addTag("matrix:pvp-disabled");

        system.runTimeout(() => {
            player.removeTag("matrix:pvp-disabled");
            clickData.delete(id);
        }, config.antiAutoClicker.timeout);
    }

    //set the clicks to the map
    clickData.set(id, { clicks: filteredClicks });
};

world.afterEvents.entityHitEntity.subscribe(({ damagingEntity }) => {
    const toggle: boolean = (world.getDynamicProperty("antiAutoClicker") ?? config.antiAutoClicker.enabled) as boolean;

    if ( toggle !== true || !(damagingEntity instanceof Player) || isAdmin (damagingEntity as Player)) return;

    AutoClicker(damagingEntity);
});

world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
    if (!initialSpawn) return;
    if (player.hasTag("matrix:pvp-disabled")) {
        player.removeTag("matrix:pvp-disabled");
    }
})
world.afterEvents.playerLeave.subscribe(({ playerId }) => {
    clickData.delete(playerId);
})
