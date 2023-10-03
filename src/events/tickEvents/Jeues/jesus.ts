import { world, Block, Player, Dimension, system, PlayerLeaveAfterEvent } from "@minecraft/server";
import config from "../../../data/config";
import { uniqueId } from "../../../util/World";
import { flag } from "../../../util/Flag";

//Paradox check! awa this is belong the Paradox AntiCheat.

let blockAtPlayer0: Block;
let blockAtPlayer1: Block;
const playerTags: string[] = ["anticheat:riding", "anticheat:may_fly"];

const playerCount = new Map<string, number>();

function onPlayerLogout(event: PlayerLeaveAfterEvent): void {
    // Remove the player's data from the map when they log off
    const playerName = event.playerId;
    playerCount.delete(playerName);
}

function timer(player: Player, dimension: Dimension, x: number, y: number, z: number) {
    player.teleport({ x: x, y: y - 2, z: z }, { dimension: dimension, rotation: { x: 0, y: 0 }, facingLocation: { x: 0, y: 0, z: 0 }, checkForBlocks: false, keepVelocity: false });
    playerCount.set(player.id, 0);
    player.applyDamage(6);
    flag(player, 'Jesus/A', config.modules.jesusA, undefined)
}

function jesusa(id: number) {
    // Get Dynamic Property (state) awa
    const jesusaBoolean: boolean = config.jesusA.state;

    // Unsubscribe if disabled in-game
    if (jesusaBoolean === false) {
        playerCount.clear();
        world.afterEvents.playerLeave.unsubscribe(onPlayerLogout);
        system.clearRun(id);
        return;
    }
    // run as each player
    const players = world.getPlayers();
    for (const player of players) {
        // Get unique ID
        const isAdmin = uniqueId(player);

        // Skip if they have permission
        if (isAdmin === true) {
            continue;
        }

        const { x, y, z } = player.location;
        const dimension = player.dimension;
        try {
            // Below Below player
            blockAtPlayer0 = player?.dimension?.getBlock({ x: x, y: y - 1, z: z }) || undefined;
            // Below player
            blockAtPlayer1 = player?.dimension?.getBlock({ x: x, y: y, z: z }) || undefined;
        } catch (error) {}

        const playerFeetY = Math.floor(y); // Round down to get the player's feet Y-coordinate

        const swimming = player.isSwimming;
        const inWater = player.isInWater;
        if (!swimming && !inWater && blockAtPlayer0 && blockAtPlayer1) {
            const isWaterOrLava = (blockAtPlayer1.typeId === "minecraft:water" && blockAtPlayer0.typeId === "minecraft:water") || (blockAtPlayer1.typeId === "minecraft:lava" && blockAtPlayer0.typeId === "minecraft:lava");
            if (isWaterOrLava && playerFeetY === blockAtPlayer1.y && playerTags.every((tag) => !player.hasTag(tag))) {
                const count = (playerCount.get(player.id) || 0) + 1;
                playerCount.set(player.id, count);

                // Flag them after 2 seconds of activity
                if (count === 1) {
                    timer(player, dimension, x, y, z);
                }
            }
        }

        // Reset count
        if (player.isOnGround) {
            playerCount.delete(player.id);
        }
    }
}

/**
 * We store the identifier in a variable
 * to cancel the execution of this scheduled run
 * if needed to do so.
 */

export const jesus_a = () => {
  world.afterEvents.playerLeave.subscribe(onPlayerLogout);
  const jesusAId = system.runInterval(() => {
      jesusa(jesusAId);
  }, 20);
}