import { world, system, Player, EntityHitEntityAfterEvent } from "@minecraft/server";
import { isAdmin } from "../../Assets/Util.js";
import { MinecraftEntityTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import { tps } from "../../Assets/Public.js";
import { registerModule, configi } from "../Modules.js";
import { DisableTags } from "../../Data/EnumData.js";
import { Action } from "../../Assets/Action.js";

const clickData: Map<string, number[]> = new Map<string, number[]>();

/**
 * @author ravriv
 * @description This checks if the player is clicking more than 22 times per second.
 */

function antiAutoClicker(config: configi, player: Player) {
    const currentTime = Date.now();
    const { id } = player;
    const clicks = clickData.get(id) ?? [];

    // Filter the clicks that are older than 1.5 seconds
    const filteredClicks = clicks.filter((clickTime) => currentTime - clickTime < 1500);

    // Calculate clicks per second
    const cps = filteredClicks.length;
    //player.runCommand(`title ${player.name} actionbar ${cps} cps`);
    // If the cps is higher than the max clicks per second, flag the player
    if (!player.hasTag(DisableTags.pvp) && tps.getTps()! > 12 && cps > config.antiAutoClicker.maxClicksPerSecond) {
        player.addTag(DisableTags.pvp);
        clickData.delete(id);
        system.runTimeout(() => {
            player.removeTag(DisableTags.pvp);
        }, config.antiAutoClicker.timeout);
    }

    // Set the clicks to the map
    clickData.set(id, filteredClicks);
}

interface ClickDataB {
    lastHitTime: number;
    hitTimeList: number[];
    lastflag: number;
}
const clickDataB: Map<string, ClickDataB> = new Map();
function antiAutoClickerB(config: configi, player: Player) {
    const now = Date.now();
    const data = clickDataB.get(player.id) ?? { lastHitTime: 0, hitTimeList: [], lastflag: 0 };
    if (data.lastHitTime == 0) {
        data.lastHitTime = now;
        clickDataB.set(player.id, data);
        return;
    }
    const hitInterval = now - data.lastHitTime;
    data.hitTimeList.push(hitInterval);
    if (data.hitTimeList.length > 2) {
        data.hitTimeList.shift();
        const currentIntervalLevel = data.hitTimeList.reduce((a, b) => a + b, 0) / data.hitTimeList.length;
        // player.sendMessage(currentIntervalLevel.toFixed(2));
        if (currentIntervalLevel < config.antiAutoClicker.minInterval) {
            if (now - data.lastflag < 9000) {
                Action.timeout(player, config.antiAutoClicker.timeout);
            }
            data.lastflag = now;
        }
    }
    data.lastHitTime = now;
    clickDataB.set(player.id, data);
}

function entityHitEntityAfterEvent(_config: configi, { damagingEntity }: EntityHitEntityAfterEvent) {
    if (damagingEntity instanceof Player && !isAdmin(damagingEntity) && !damagingEntity.hasTag(DisableTags.pvp)) {
        const click = clickData.get(damagingEntity.id);
        if (!click) return;
        click.push(Date.now());
        clickData.set(damagingEntity.id, click);
    }
}

registerModule(
    "antiAutoClicker",
    false,
    [clickData, clickDataB],
    {
        intick: async (config, player) => antiAutoClicker(config, player),
        tickInterval: 20,
    },
    {
        worldSignal: world.afterEvents.entityHitEntity,
        playerOption: { entityTypes: [MinecraftEntityTypes.Player] },
        then: async (config, event) => {
            entityHitEntityAfterEvent(config, event);
            antiAutoClickerB(config, event.damagingEntity as Player);
        },
    }
);
