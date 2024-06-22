import { PlayerBreakBlockBeforeEvent, PlayerInteractWithBlockBeforeEvent, PlayerInteractWithEntityBeforeEvent, PlayerPlaceBlockBeforeEvent, Vector3, system, world } from "@minecraft/server";
import { c, isAdmin, rawstr } from "../../Assets/Util";
import { registerModule, configi } from "../Modules";

// delcare the variable
let radius: number;
let centerX: number;
let centerZ: number;
let spawn: Vector3;

const lastSafePos = new Map<string, Vector3>();
export { lastSafePos };

/**
 * Handles the world border logic for the game.
 * @param config - The configuration object for the world border.
 */
function worldBorder(config: configi) {
    // Get all the players in the game
    const players = world.getAllPlayers();
    // Get the radius and spawn location from the config
    radius = config.worldBorder.radius;
    spawn = world.getDefaultSpawnLocation();
    // Calculate the center coordinates based on the config
    centerX = config.worldBorder.useSpawnLoc ? spawn.x : config.worldBorder.centerX;
    centerZ = config.worldBorder.useSpawnLoc ? spawn.z : config.worldBorder.centerZ;

    // Loop through each player
    for (const player of players) {
        // Skip admin players if the config says to
        if (config.worldBorder.stopAdmin && isAdmin(player)) continue;
        // Get the player's location
        const { x, z } = player.location;
        // Check if the player is outside the border
        if (Math.abs(x - centerX) > radius || Math.abs(z - centerZ) > radius) {
            // Teleport the player to the last safe position or the spawn location
            const teleportShould = lastSafePos.get(player.id);
            if (!teleportShould) player.teleport(spawn);
            else player.teleport(teleportShould);
            // Send a message to the player indicating they have reached the border
            player.sendMessage(new rawstr(true).tra("border.reached").parse());
        } else {
            // Get the player's velocity
            const { x, z } = player.getVelocity();
            // If the player is not moving, save their location as the last safe position
            if (Math.hypot(x, z) == 0) lastSafePos.set(player.id, player.location);
        }
    }
};
/**
 * Cancels a block break or place event if the player is outside the world border.
 * @param event - The event object containing the player and block information.
 */
function blockCancel (event: PlayerBreakBlockBeforeEvent | PlayerPlaceBlockBeforeEvent) {
    // Check if the event is admin triggered and the config says to skip
    if (c().worldBorder.stopAdmin && isAdmin(event.player)) return;

    // Get the block location and check if it is outside the world border
    const { x, z } = event.block.location;
    if (Math.abs(x - centerX) > radius || Math.abs(z - centerZ) > radius) {
        // Cancel the event and send a message to the player
        event.cancel = true;
        system.run(() => event.player.sendMessage(new rawstr(true).tra("border.outside").parse()));
    }
};

/**
 * Cancels a block interact event if the player is outside the world border.
 * @param event - The event object containing the player and block information.
 */
function playerInteractBlock (event: PlayerInteractWithBlockBeforeEvent) {
    // Check if the event is admin triggered and the config says to skip
    if (c().worldBorder.stopAdmin && isAdmin(event.player)) return;

    // Get the block location and check if it is outside the world border
    const {
        block: {
            location: { x, z },
        },
    } = event;
    if (Math.abs(x - centerX) > radius || Math.abs(z - centerZ) > radius) {
        // Cancel the event and send a message to the player
        event.cancel = true;
        system.run(() => event.player.sendMessage(new rawstr(true).tra("border.interact").parse()));
    }
};

/**
 * Cancels a block interact event if the player is outside the world border.
 * This function specifically handles entity interactions.
 * @param event - The event object containing the player and entity information.
 */
function playerInteractEntity (event: PlayerInteractWithEntityBeforeEvent) {
    // Check if the event is admin triggered and the config says to skip
    if (c().worldBorder.stopAdmin && isAdmin(event.player)) return;

    // Get the entity location and check if it is outside the world border
    const {
        target: {
            location: { x, z },
        },
    } = event;
    if (Math.abs(x - centerX) > radius || Math.abs(z - centerZ) > radius) {
        // Cancel the event and send a message to the player
        event.cancel = true;
        system.run(() => event.player.sendMessage(new rawstr(true).tra("border.interact").parse()));
    }
};

// Register the module
registerModule("worldBoarder", true, [lastSafePos],
    {
        onTick: async (config) => worldBorder(config),
        tickInterval: 1
    },
    {
        worldSignal: world.beforeEvents.playerBreakBlock,
        then: async (_config, event: PlayerBreakBlockBeforeEvent) => blockCancel(event),
    },
    {
        worldSignal: world.beforeEvents.playerPlaceBlock,
        then: async (_config, event: PlayerPlaceBlockBeforeEvent) => blockCancel(event),
    },
    {
        worldSignal: world.beforeEvents.playerInteractWithBlock,
        then: async (_config, event: PlayerInteractWithBlockBeforeEvent) => playerInteractBlock(event),
    },
    {
        worldSignal: world.beforeEvents.playerInteractWithEntity,
        then: async (_config, event: PlayerInteractWithEntityBeforeEvent) => playerInteractEntity(event),
    },
)