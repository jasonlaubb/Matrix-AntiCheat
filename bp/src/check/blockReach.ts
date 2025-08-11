import { GameMode, PlayerBreakBlockBeforeEvent, PlayerInteractWithBlockBeforeEvent, PlayerPlaceBlockBeforeEvent, system, world } from "@minecraft/server";
import { distance } from "../util/mathUtil";
export default {
    property: "antiBlockReachEnable",
    enable: () => {
        world.beforeEvents.playerInteractWithBlock.subscribe(blockEvent);
        world.beforeEvents.playerBreakBlock.subscribe(blockEvent);
        world.beforeEvents.playerPlaceBlock.subscribe(blockEvent);
    },
    disable: () => {
        world.beforeEvents.playerInteractWithBlock.unsubscribe(blockEvent);
        world.beforeEvents.playerBreakBlock.unsubscribe(blockEvent);
        world.beforeEvents.playerPlaceBlock.unsubscribe(blockEvent);
    }
}
function blockEvent (event: PlayerInteractWithBlockBeforeEvent | PlayerBreakBlockBeforeEvent | PlayerPlaceBlockBeforeEvent) {
    const { player, block } = event;
    if (player.isOp() || player.getGameMode() === GameMode.Creative) return;
    const pos = block.center();
    const reach = distance(pos, player.getHeadLocation());
    const reachLimit = player.isFalling && player.location.y < block.location.y ? 5 : 6;
    if (reach > reachLimit) {
        event.cancel = true;
        system.run(() => player.flag("BlockReach", "A", "World", { reach }));
    }
}