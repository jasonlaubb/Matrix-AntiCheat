import { GameMode, PlayerGameModeChangeBeforeEvent, PlayerSpawnAfterEvent, world } from "@minecraft/server";
import { get } from "../util/database";
export function enableAntiGameMode () {
    if (world.antiGamemodeEnabled) return;
    world.antiGamemodeEnabled = true;
    world.beforeEvents.playerGameModeChange.subscribe(gamemodeChange);
    world.afterEvents.playerSpawn.subscribe(onJoin);
}
export function disableAntiGameMode () {
    if (!world.antiGamemodeEnabled) return;
    delete world.antiGamemodeEnabled;
    world.beforeEvents.playerGameModeChange.unsubscribe(gamemodeChange);
    world.afterEvents.playerSpawn.unsubscribe(onJoin);
}
function gamemodeChange(event: PlayerGameModeChangeBeforeEvent) {
    if (event.player.isOp()) return;
    switch (event.toGameMode) {
        case GameMode.Adventure: {
            if (get("antiGma")) event.cancel = true;
            break;
        }
        case GameMode.Creative: {
            if (get("antiGmc")) event.cancel = true;
            break;
        }
        case GameMode.Spectator: {
            if (get("antiGmsp")) event.cancel = true;
            break;
        }
        case GameMode.Survival: {
            if (get("antiGms")) event.cancel = true;
        }
    }
}
function onJoin({ player, initialSpawn }: PlayerSpawnAfterEvent) {
    if (!initialSpawn || player.isOp()) return;
    let reset = false;
    switch (player.getGameMode()) {
        case GameMode.Adventure: {
            if (get("antiGma")) reset = true;
            break;
        }
        case GameMode.Creative: {
            if (get("antiGmc")) reset = true;
            break;
        }
        case GameMode.Spectator: {
            if (get("antiGmsp")) reset = true;
            break;
        }
        case GameMode.Survival: {
            if (get("antiGms")) reset = true;
        }
    }
    if (reset) {
        player.setGameMode();
    }
}