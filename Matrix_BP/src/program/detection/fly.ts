import { Dimension, EquipmentSlot, Player, Vector3 } from "@minecraft/server";
import { IntegratedSystemEvent, Module } from "../../matrixAPI";
import { rawtextTranslate } from "../../util/rawtext";
import { MinecraftEffectTypes, MinecraftItemTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import { fastAbs } from "../../util/fastmath";
const MAX_VELOCITY_Y = 0.7;
const MIN_REQUIRED_REPEAT_AMOUNT = 6;
const HIGH_VELOCITY_Y = 22;
interface FlyData {
    lastVelocityY: number;
    lastOnGroundLocation: Vector3;
    lastFlaggedLocation: Vector3;
    velocityYList: number[];
}
const flyData = new Map<string, FlyData>();
let eventId: IntegratedSystemEvent;
const fly = new Module()
    .addCategory("detection")
    .setName(rawtextTranslate("module.fly.name"))
    .setDescription(rawtextTranslate("module.fly.description"))
    .setToggleId("antiFly")
    .setPunishment("ban")
    .onModuleEnable(() => {
        eventId = Module.subscribePlayerTickEvent(tickEvent);
    })
    .onModuleDisable(() => {
        Module.clearPlayerTickEvent(eventId);
        flyData.clear();
    })
    .initPlayer((playerId, player) => {
        flyData.set(playerId, {
            lastVelocityY: 0,
            lastOnGroundLocation: player.location,
            velocityYList: [],
            lastFlaggedLocation: player.location,
        });
    })
    .initClear((playerId) => {
        flyData.delete(playerId);
    });
fly.register();
/**
 * @author jasonlaubb
 * @description Anti Fly.
 */
function tickEvent(player: Player) {
    const now = Date.now();
    const data = flyData.get(player.id)!;
    const { y: velocityY } = player.getVelocity();
    const surroundAir = isSurroundedByAir(player.location, player.dimension);
    if (player.isOnGround && velocityY === 0) {
        data.lastOnGroundLocation = player.location;
    } else if (now - player.timeStamp.knockBack > 2000 && now - player.timeStamp.riptide > 5000 && data.lastVelocityY < -MAX_VELOCITY_Y && !player.hasTag("riding") && !player.isFlying && !player.isOnGround && !player.isGliding && surroundAir) {
        if (velocityY > MAX_VELOCITY_Y) {
            player.teleport(data.lastOnGroundLocation);
            player.flag(fly);
        }
    }
    if (velocityY > HIGH_VELOCITY_Y && !player.isGliding) {
        player.teleport(data.lastOnGroundLocation);
        player.flag(fly);
    }
    data.velocityYList.push(velocityY);
    if (data.velocityYList.length > 40) data.velocityYList.shift();
    if (data.velocityYList.length >= 40 && !player.getEffect(MinecraftEffectTypes.JumpBoost) && data.velocityYList.some((yV) => yV < -MAX_VELOCITY_Y)) {
        const { highestRepeatedVelocity, highestRepeatedAmount } = repeatChecks(data.velocityYList);
        if (highestRepeatedAmount >= MIN_REQUIRED_REPEAT_AMOUNT && highestRepeatedVelocity > MAX_VELOCITY_Y) {
            player.teleport(data.lastOnGroundLocation);
            player.flag(fly);
        }
    }
    if (!player.isGliding && fastAbs(velocityY) <= MAX_VELOCITY_Y && surroundAir && (player.isOnGround || player.hasTag("isOnGround"))) {
        player.flag(fly);
    }
    if (player.isGliding && !player.getComponent("equippable")?.getEquipmentSlot(EquipmentSlot.Chest)?.getItem()?.matches(MinecraftItemTypes.Elytra) && JSON.stringify(player.location) != JSON.stringify(data.lastFlaggedLocation)) {
        player.teleport(data.lastOnGroundLocation);
        data.lastFlaggedLocation = player.location;
        player.flag(fly);
    }
    data.lastVelocityY = velocityY;
    flyData.set(player.id, data);
}
function isSurroundedByAir(centerLocation: Vector3, dimension: Dimension) {
    return [-1, 0, 1].every((x) => {
        return [-1, 0, 1].every((y) => {
            return [-1, 0, 1].every((z) => {
                const location = { x: centerLocation.x + x, y: centerLocation.y + y, z: centerLocation.z + z };
                try {
                    return dimension.getBlock(location)?.isAir;
                } catch {
                    return true;
                }
            });
        });
    });
}

function repeatChecks(list: number[]) {
    const map = new Map<number, number>();
    let highestRepeatedVelocity = 0;
    let highestRepeatedAmount = 0;
    for (const velocityY of list) {
        if (velocityY == 0) continue;
        map.set(velocityY, (map.get(velocityY) ?? 0) + 1);
        if (map.get(velocityY)! > highestRepeatedAmount) {
            highestRepeatedVelocity = velocityY;
            highestRepeatedAmount = map.get(velocityY)!;
        }
    }
    return { highestRepeatedVelocity, highestRepeatedAmount };
}
