import { world, system, Player, EntityHitEntityAfterEvent } from "@minecraft/server";
import { flag, isAdmin } from "../../Assets/Util.js";
import { MinecraftEntityTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import { tps } from "../../Assets/Public.js";
import { registerModule, configi } from "../Modules.js";

interface ClickData {
    clicks: number[];
}

const clickData: Map<string, ClickData> = new Map<string, ClickData>();

/**
 * @author ravriv
 * @description This checks if the player is clicking more than 22 times per second.
 */

function antiAutoClicker (config: configi, player: Player) {
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
        flag(player, "Auto Clicker", "A", config.antiAutoClicker.maxVL, config.antiAutoClicker.punishment, ["Click Per Second" + ":" + cps.toFixed(0)]);

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

function entityHitEntityAfterEvent (_config: configi, { damagingEntity }: EntityHitEntityAfterEvent) {
    if (damagingEntity instanceof Player && !isAdmin(damagingEntity)) {
        const click = clickData.get(damagingEntity.id)?.clicks
        click.push(Date.now())
        clickData.set(damagingEntity.id, { clicks: click })
    }
}

registerModule("antiAutoClicker", false, [clickData],
    {
        intick: async (config, player) => antiAutoClicker(config, player),
        tickInterval: 1
    },
    {
        worldSignal: world.afterEvents.entityHitEntity,
        playerOption: { entityTypes: [MinecraftEntityTypes.Player] },
        then: async (config, event) => entityHitEntityAfterEvent(config, event),
    }
)