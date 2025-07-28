import { EntityHitBlockAfterEvent, Player, PlayerBreakBlockAfterEvent, world } from "@minecraft/server";
import { stringXyz } from "../util/util";
export default {
    property: "antiinstabreakEnable",
    enable: () => {
        world.afterEvents.entityHitBlock.subscribe(blocKHit, {
            entityTypes: ["minecraft:player"],
        });
        world.afterEvents.playerBreakBlock.subscribe(blockBreak);
    },
    disable: () => {
        world.afterEvents.entityHitBlock.unsubscribe(blocKHit);
        world.afterEvents.playerBreakBlock.unsubscribe(blockBreak);
    }
}
function blocKHit ({ damagingEntity, hitBlock }: EntityHitBlockAfterEvent) {
    const now = Date.now();
    (damagingEntity as Player).instabreakLastHit ??= [];
    (damagingEntity as Player).instabreakLastHit.push({ time: now, id: stringXyz(hitBlock.location) });
}
function blockBreak ({ player, block }: PlayerBreakBlockAfterEvent) {
    player.instabreakLastHit ??= [];
    const hitRecord = player.instabreakLastHit.findIndex(({ id }) => id === stringXyz(block.location));
    if (hitRecord === -1) {
        player.flag("Instabreak", "A", "World");
    } else {
        const data = player.instabreakLastHit.splice(hitRecord, 1);
        if (Date.now() < data[0].time) {
            player.flag("Instabreak", "B", "World");
        }
    }
}