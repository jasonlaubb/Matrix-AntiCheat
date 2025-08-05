import { EntityRemoveBeforeEvent, Player, world } from "@minecraft/server";
import { addCheckInterval, removeCheckInterval } from "../util/tick";
export default {
    property: "antiXpEnable",
    enable: () => {
        world.beforeEvents.entityRemove.subscribe(onEntityRemove);
        addCheckInterval(tickEvent);
    },
    disable: () => {
        world.beforeEvents.entityRemove.unsubscribe(onEntityRemove);
        removeCheckInterval(tickEvent);
    },
}
function onEntityRemove ({ removedEntity }: EntityRemoveBeforeEvent) {
    if (removedEntity.typeId !== "minecraft:xp_orb") return;
    const neareastPlayers = removedEntity.dimension.getPlayers({
        location: removedEntity.location,
        maxDistance: 3.5,
    });
    if (neareastPlayers.length === 0) return;
    const now = Date.now();
    neareastPlayers.forEach((player) => player.xpLastValid = now);
}
function tickEvent (player: Player) {
    const currentXp = player.getTotalXp();
    player.xpLastXpAmount ??= currentXp;
    if (currentXp > player.xpLastXpAmount && !(player.xpLastValid && Date.now() - player.xpLastValid > 300)) {
        player.addExperience(player.xpLastXpAmount - currentXp); // Remove the experience that is invalid
    } else player.xpLastXpAmount = currentXp;
}