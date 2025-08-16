//@ts-check
import { CustomCommandParamType, Player, PlayerPermissionLevel, system } from "@minecraft/server";
system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand({
        cheatsRequired: false,
        name: "matrix:vanish",
        permissionLevel: 1,
        description: "Vanish yourself",
    }, (origin) => {
        if (!origin?.sourceEntity || !(origin.sourceEntity instanceof Player)) return { status: 1 };
        system.run(() => origin.sourceEntity?.triggerEvent("matrix:vanish"));
        return { status: 0, message: "§7[§aMatrix§7] §fVanished!" }
    });
    event.customCommandRegistry.registerCommand({
        cheatsRequired: false,
        name: "matrix:unvanish",
        permissionLevel: 1,
        description: "Unvanish yourself",
    }, (origin) => {
        if (!origin?.sourceEntity || !(origin.sourceEntity instanceof Player)) return { status: 1 };
        system.run(() => origin.sourceEntity?.triggerEvent("matrix:unvanish"));
        return { status: 0, message: "§7[§aMatrix§7] §fUnvanished!" }
    });
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
        if (!origin?.sourceEntity || !(origin.sourceEntity instanceof Player)) return { status: 1 };
        if (players.length === 0) return { status: 1, message: "§7[§aMatrix§7] §fYou should select more than 1 player." };
        if (players.some(({ commandPermissionLevel, playerPermissionLevel }) => commandPermissionLevel >= 1 || playerPermissionLevel === PlayerPermissionLevel.Operator)) return { status: 1, message: "You can't disconnect an operator!" };
        system.run(() => players.forEach((player) => player?.triggerEvent("matrix:tempkick")));
        return { status: 0, message: "§7[§aMatrix§7] §fDisconnected: " + players.join(", ") };
    });
});