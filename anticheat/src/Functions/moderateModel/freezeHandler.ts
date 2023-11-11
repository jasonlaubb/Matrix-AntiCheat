import {
    world,
    system, 
    Vector3,
    Player
} from "@minecraft/server";
import { isAdmin } from "../../Assets/Util";

class Freeze {
    location: Vector3;
    dimension: string;
}

system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        if (isAdmin (player)) continue;
        let freezeInfo = player.getDynamicProperty("freeze") as string | undefined | Freeze;
        if (freezeInfo === undefined) return

        freezeInfo = JSON.parse(freezeInfo as string) as Freeze;

        const freeze = freezeInfo as Freeze

        player.teleport(freeze.location, {
        dimension: world.getDimension(freeze.dimension)
        })
        player.addEffect("minecraft:slowness", 2, { amplifier: 255, showParticles: false })
    }
}, 20)

function freeze (player: Player) {
    const floorPos = {
        x: Math.floor(player.location.x),
        y: Math.floor(player.location.y),
        z: Math.floor(player.location.z)
    } as Vector3
    if (player.getDynamicProperty("freeze") !== undefined) return false
    system.run(() => player.setDynamicProperty("freeze", JSON.stringify({ location: floorPos, dimension: player.dimension })))
    return true
}

function unfreeze (player: Player) {
    if (player.getDynamicProperty("freeze") === undefined) return false
    system.run(() => player.setDynamicProperty("freeze", undefined))
    return true
}

export { freeze, unfreeze }