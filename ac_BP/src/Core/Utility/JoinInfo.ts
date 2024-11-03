import { configi, registerModule } from "../Modules";
import { PlayerSpawnAfterEvent, world } from "@minecraft/server";
async function onPlayerJoin (_config: configi, event: PlayerSpawnAfterEvent) {
	const player = event.player;
    world.sendMessage(player.name + " join the game")
}
registerModule("welcomer", true, [], {
    worldSignal: world.afterEvents.playerSpawn,
    then: onPlayerJoin,
});
