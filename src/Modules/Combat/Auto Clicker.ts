import { world, system, Player, EntityHitEntityAfterEvent, EntityHitBlockAfterEvent, PlayerLeaveAfterEvent } from "@minecraft/server";
import { flag, isAdmin, c } from "../../Assets/Util.js";
import lang from "../../Data/Languages/lang.js";
import { MinecraftEntityTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import { tps } from "../../Assets/Public.js";

interface ClickData {
    clicks: number[];
}

const clickData: Map<string, ClickData> = new Map<string, ClickData>();

/**
 * @author ravriv
 * @description This checks if the player is clicking more than 22 times per second.
 */

function AutoClicker(player: Player) {
    const config = c();
    const currentTime = Date.now();
    const { id } = player;
    const { clicks } = clickData.get(id) || { clicks: [] };

    // Filter the clicks that are older than 1.5 seconds
    const filteredClicks = clicks.filter((clickTime) => currentTime - clickTime < 1500);
    filteredClicks.push(currentTime);

    // Calculate clicks per second
    const cps = filteredClicks.length;

    // If the cps is higher than the max clicks per second, flag the player
    if (!player.hasTag("matrix:pvp-disabled") && tps.getTps() > 12 && cps > config.antiAutoClicker.maxClicksPerSecond) {
        // A - false positive: very low, efficiency: high
        flag(player, "Auto Clicker", "A", config.antiAutoClicker.maxVL, config.antiAutoClicker.punishment, [`${lang(">Click Per Second")}:${cps.toFixed(0)}`]);

        if (!config.slient) {
            player.applyDamage(6);
            player.addTag("matrix:pvp-disabled");

            system.runTimeout(() => {
                player.removeTag("matrix:pvp-disabled");
                clickData.delete(id);
            }, config.antiAutoClicker.timeout);
        }
    }

    // Set the clicks to the map
    clickData.set(id, { clicks: filteredClicks });
}

const antiAutoClicker = ({ damagingEntity }: EntityHitEntityAfterEvent | EntityHitBlockAfterEvent) => {
    if (isAdmin(damagingEntity as Player)) return;

    AutoClicker(damagingEntity as Player);
};

const playerLeave = ({ playerId }: PlayerLeaveAfterEvent) => {
    clickData.delete(playerId);
};

export default {
    enable() {
        world.afterEvents.entityHitEntity.subscribe(antiAutoClicker, { entityTypes: [MinecraftEntityTypes.Player] });
        world.afterEvents.playerLeave.subscribe(playerLeave);
    },
    disable() {
        clickData.clear();
        world.afterEvents.entityHitEntity.unsubscribe(antiAutoClicker);
        world.afterEvents.playerLeave.unsubscribe(playerLeave);
    },
};
