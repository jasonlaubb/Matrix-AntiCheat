import { EquipmentSlot, ItemUseAfterEvent, Player, world } from "@minecraft/server";
import { pythag } from "../util/mathUtil";
import { ElytraFlyData } from "../../../global";
import { addCheckInterval, removeCheckInterval } from "../util/tick";
function tickEvent(player: Player) {
    const data: ElytraFlyData = player.elytraFlyData ?? {
        startGlideTime: 0,
        startGlideSpeed: 0,
        isSpeedDecreasing: false,
        highestGlidingSpeed: 0,
        isLastTickGliding: false,
        usedRocket: false,
        lastSpeedDeviation: 0,
        triggeredType2: false,
        lastSpeedXZ: 0,
    };
    const now = Date.now();
    if (!data.isLastTickGliding && player.isGliding) {
        data.startGlideTime = now;
    }
    const { x, z } = player.getVelocity();
    const glidingSpeed = pythag(x, z);
    const speedDeviation = data.lastSpeedXZ / glidingSpeed;
    if (player.isGliding && !data.usedRocket && now - data.startGlideTime > 1000) {
        if (glidingSpeed > data.highestGlidingSpeed) {
            data.highestGlidingSpeed = glidingSpeed;
        } else if (glidingSpeed > 0) {
            if (speedDeviation > 50) {
                dropElytra(player);
                player.flag("ElytraFly", "A", "Movement", { speedDeviation });
            } else if (speedDeviation.toFixed(4) === data.lastSpeedDeviation.toFixed(4)) {
                if (data.triggeredType2) {
                    data.triggeredType2 = false;
                    dropElytra(player);
                    player.flag("ElytraFly", "B", "Movement", { fixedSpeedDeviation: speedDeviation.toFixed(4) });
                }
                data.triggeredType2 = true;
            } else data.triggeredType2 = false;
        }
    }
    if (!player.isGliding) {
        data.usedRocket = false;
        data.highestGlidingSpeed = 0;
    }
    data.lastSpeedDeviation = speedDeviation;
    data.isLastTickGliding = player.isGliding;
    data.lastSpeedXZ = glidingSpeed;
    player.elytraFlyData = data;
}
function onItemUse({ itemStack, source }: ItemUseAfterEvent) {
    if (source.isGliding && itemStack.typeId === "minecraft:firework_rocket") {
        if (source.elytraFlyData) source.elytraFlyData.usedRocket = true;
    }
}
function dropElytra(player: Player) {
    const slot = player.getComponent("equippable")?.getEquipmentSlot(EquipmentSlot.Chest);
    const item = slot?.getItem();
    if (item) {
        // Good bye elytra >w<
        player.dimension.spawnItem(item, player.location);
        slot!.setItem();
    }
}
export default {
    property: "antiElytraFlyEnable",
    enable: () => {
        addCheckInterval(tickEvent);
        world.afterEvents.itemUse.subscribe(onItemUse);
    },
    disable: () => {
        removeCheckInterval(tickEvent);
        world.afterEvents.itemUse.unsubscribe(onItemUse);
    },
};
