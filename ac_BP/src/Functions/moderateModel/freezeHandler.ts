import { world, system, Vector3, Player } from "@minecraft/server";
import { isAdmin } from "../../Assets/Util";

interface Freeze {
    location: Vector3;
    dimension: string;
}

system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        if (isAdmin(player)) continue;
        let freezeInfo = player.getDynamicProperty("freeze") as string | undefined;
        if (freezeInfo === undefined) continue;

        freezeInfo = JSON.parse(freezeInfo as string);

        const freeze = freezeInfo as any as Freeze;

        try {
            player.teleport(freeze.location, {
                dimension: world.getDimension(freeze.dimension),
                rotation: { x: 0, y: 0 },
            });
        } catch {
            player.teleport(freeze.location, {
                dimension: player.dimension,
                rotation: { x: 0, y: 0 },
            });
            freeze.dimension = player.dimension.id;
            player.setDynamicProperty("freeze", JSON.stringify(freeze));
        }
        player.runCommand("inputpermission set @s movement disabled");
        player.runCommand("inputpermission set @s camera disabled");
    }
}, 20);

function freeze(player: Player) {
    const floorPos = {
        x: Math.floor(player.location.x),
        y: Math.floor(player.location.y),
        z: Math.floor(player.location.z),
    } as Vector3;
    if (player.getDynamicProperty("freeze") !== undefined) return false;
    system.run(() => {
        player.setDynamicProperty("freeze", JSON.stringify({ location: floorPos, dimension: player.dimension.id }));
    });
    return true;
}

function unfreeze(player: Player) {
    if (player.getDynamicProperty("freeze") === undefined) return false;
    system.run(() => {
        player.runCommand("inputpermission set @s movement enabled");
        player.runCommand("inputpermission set @s camera enabled");
        player.setDynamicProperty("freeze", undefined);
    });
    return true;
}

export { freeze, unfreeze };
