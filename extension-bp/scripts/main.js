//@ts-check
import {
    CustomCommandParamType,
    Player,
    PlayerPermissionLevel,
    system
} from "@minecraft/server";

/**
 * Checks if the origin is a valid player.
 * @param {import("@minecraft/server").CustomCommandOrigin} origin
 * @returns {Player | null}
 */
function getValidPlayer(origin) {
    return origin?.sourceEntity instanceof Player ? origin.sourceEntity : null;
}

/**
 * Triggers a player event safely.
 * @param {Player} player
 * @param {string} eventName
 */
function triggerPlayerEvent(player, eventName) {
    system.run(() => {
        if (player.isValid) {
            player.triggerEvent(eventName);
        }
    });
}

/**
 * Sends a formatted Matrix message to a player.
 * @param {Player} player
 * @param {string} message
 */
function sendMessage(player, message) {
    player.sendMessage(`§7[§aMatrix§7] §f${message}`);
}

system.beforeEvents.startup.subscribe((event) => {
    // Vanish Command
    event.customCommandRegistry.registerCommand({
        cheatsRequired: false,
        name: "matrix:vanish",
        permissionLevel: 1,
        description: "Vanish yourself"
    }, (origin) => {
        const player = getValidPlayer(origin);
        if (!player) return { status: 1 };

        triggerPlayerEvent(player, "matrix:vanish");
        sendMessage(player, "You are now vanished!");
        return { status: 0 };
    });

    // Unvanish Command
    event.customCommandRegistry.registerCommand({
        cheatsRequired: false,
        name: "matrix:unvanish",
        permissionLevel: 1,
        description: "Unvanish yourself"
    }, (origin) => {
        const player = getValidPlayer(origin);
        if (!player) return { status: 1 };

        triggerPlayerEvent(player, "matrix:unvanish");
        sendMessage(player, "You are now unvanished!");
        return { status: 0 };
    });

    // Tempkick Command
    event.customCommandRegistry.registerCommand({
        cheatsRequired: false,
        name: "matrix:tempkick",
        permissionLevel: 1,
        description: "Disconnect a player",
        mandatoryParameters: [
            {
                name: "player",
                type: CustomCommandParamType.PlayerSelector
            }
        ]
    }, (origin, players) => {
        const executor = getValidPlayer(origin);
        if (!executor) return { status: 1 };

        if (players.length === 0) {
            sendMessage(executor, "You must select at least one player.");
            return { status: 1 };
        }

        const protectedPlayers = players.filter(p =>
            p.commandPermissionLevel >= 1 ||
            p.playerPermissionLevel === PlayerPermissionLevel.Operator
        );

        if (protectedPlayers.length > 0) {
            sendMessage(executor, "You can't disconnect an operator!");
            return { status: 1 };
        }

        system.run(() => {
            players.forEach(player => {
                if (player.isValid) {
                    player.triggerEvent("matrix:tempkick");
                }
            });
        });

        sendMessage(executor, `Disconnected: ${players.map(p => p.name).join(", ")}`);
        return { status: 0 };
    });
});