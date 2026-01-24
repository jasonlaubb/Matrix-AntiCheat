import { PlayerPlaceBlockAfterEvent, Vector3, world } from "@minecraft/server";
export default {
    property: "antiSurroundEnable",
    enable() {
        world.afterEvents.playerPlaceBlock.subscribe(blockPlace);
    },
    disable() {
        world.afterEvents.playerPlaceBlock.unsubscribe(blockPlace);
    },
};
function blockPlace({ player, block }: PlayerPlaceBlockAfterEvent) {
    if (block.typeId === "minecraft:obsidian" && player.isOnGround && !player.canBypass()) {
        const now = Date.now();
        const { x, y, z } = floorPos(player.location);
        const { x: x2, y: y2, z: z2 } = block.location;
        if (y === y2 && Math.abs(x - x2) <= 1 && Math.abs(z - z2) <= 1) {
            const interval = now - player.surroundLastPlaceObsidian;
            if (interval < 100) {
                player.surroundNearbyFlag ??= 0;
                player.surroundNearbyFlag++;
                if (player.surroundNearbyFlag >= 3) {
                    player.flag("Surround", "A", "Block", { interval });
                }
            } else if (player.surroundNearbyFlag > 0) player.surroundNearbyFlag = 0;
        }
        player.surroundLastPlaceObsidian = now;
    }
}
function floorPos({ x, y, z }: Vector3) {
    return {
        x: Math.floor(x),
        y: Math.floor(y),
        z: Math.floor(z),
    };
}
