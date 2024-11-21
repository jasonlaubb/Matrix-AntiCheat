import { EntityHitEntityAfterEvent, Player, world } from "@minecraft/server";
import { IntegratedSystemEvent, Module } from "../../matrixAPI";
import { rawtextTranslate } from "../../util/rawtext";
import { calculateAngleFromView, calculateDistance } from "../../util/fastmath";
import { getAngleLimit } from "../../util/util";
import { fastAbs } from "../../util/fastmath";
const KILLAURA_DISTANCE_THRESHOLD = 3.5;
const KILLAURA_PVP_DISTANCE_THRESHOLD = 4.5;
const KILLAURA_ROTATION_THRESHOLD = 79;

let eventId: IntegratedSystemEvent;
const killaura = new Module()
    .addCategory("detection")
    .setName(rawtextTranslate("module.killaura.name"))
    .setDescription(rawtextTranslate("module.killaura.description"))
    .setToggleId("antiKillAura")
    .setPunishment("ban")
    .onModuleEnable(() => {
        world.afterEvents.entityHitEntity.subscribe(entityHitEntity);
        eventId = Module.subscribePlayerTickEvent(tickEvent);
    })
    .onModuleDisable(() => {
        killauraData.clear();
        world.afterEvents.entityHitEntity.unsubscribe(entityHitEntity);
        Module.clearPlayerTickEvent(eventId);
    });

killaura.register();

const killauraData = new Map<string, string[]>();

/**
 * @author jasonlaubb
 * @description The basic killaura detection module.
 */
function entityHitEntity({ damagingEntity: player, hitEntity: target }: EntityHitEntityAfterEvent) {
    if (!(player instanceof Player) || player.isAdmin()) return;
    if (target.id === player.id) {
        player.flag(killaura);
        return;
    }

    const distance = calculateDistance(player.location, target.location);
    const isPvp = target instanceof Player;
    const rotationY = player.getRotation().y;

    if (isPvp && distance > KILLAURA_PVP_DISTANCE_THRESHOLD && fastAbs(rotationY) > KILLAURA_ROTATION_THRESHOLD) {
        player.flag(killaura);
        return;
    }

    if (distance > KILLAURA_DISTANCE_THRESHOLD && isPvp) {
        const angle = calculateAngleFromView(player.location, target.location, rotationY);
        const angleLimit = getAngleLimit(player.clientSystemInfo.platformType);
        if (angle > angleLimit) {
            player.flag(killaura);
            return;
        }
    }

    const data = killauraData.get(player.id) ?? [];
    if (data.includes(target.id)) data.push(target.id);
    killauraData.set(player.id, data);
    if (data.length >= 3) {
        player.flag(killaura);
    }
}

function tickEvent(player: Player) {
    killauraData.set(player.id, []);
}
