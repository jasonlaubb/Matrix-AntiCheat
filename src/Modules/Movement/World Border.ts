import { PlayerBreakBlockBeforeEvent, PlayerInteractWithBlockBeforeEvent, PlayerInteractWithEntityBeforeEvent, PlayerPlaceBlockBeforeEvent, Vector3, system, world } from "@minecraft/server";
import { c, isAdmin } from "../../Assets/Util";

// delcare the variable
let radius: number;
let centerX: number;
let centerZ: number;
let spawn: Vector3;

const lastSafePos = new Map<string, Vector3>();
export { lastSafePos };

const worldBorder = () => {
    const players = world.getAllPlayers();
    const config = c();
    radius = config.worldBorder.radius;
    spawn = world.getDefaultSpawnLocation();
    centerX = config.worldBorder.useSpawnLoc ? spawn.x : config.worldBorder.centerX;
    centerZ = config.worldBorder.useSpawnLoc ? spawn.z : config.worldBorder.centerZ;
    //world.getAllPlayers()[0].runCommand(`title @s actionbar spawn = ${[centerX,centerZ].join(", ")}\nradius = ${radius}\ndistanceX = ${Math.abs(centerX - world.getAllPlayers()[0].location.x)}`)

    for (const player of players) {
        if (config.worldBorder.stopAdmin && isAdmin(player)) continue;
        const { x, z } = player.location;
        if (Math.abs(x - centerX) > radius || Math.abs(z - centerZ) > radius) {
            const teleportShould = lastSafePos.get(player.id);
            if (!teleportShould) player.teleport(spawn);
            else player.teleport(teleportShould);
            player.sendMessage(`§bMatrix §7>§c ${lang(".Border.reached")}`);
        } else {
            const { x, z } = player.getVelocity();
            if (Math.hypot(x, z) == 0) lastSafePos.set(player.id, player.location);
        }
    }
};
const blockCancel = (event: PlayerBreakBlockBeforeEvent | PlayerPlaceBlockBeforeEvent) => {
    if (c().worldBorder.stopAdmin && isAdmin(event.player)) return;
    const { x, z } = event.block.location;
    if (Math.abs(x - centerX) > radius || Math.abs(z - centerZ) > radius) {
        event.cancel = true;
        system.run(() => event.player.sendMessage(`§bMatrix §7>§c ${lang(".Border.outside")}`));
    }
};

const playerInteractBlock = (event: PlayerInteractWithBlockBeforeEvent) => {
    if (c().worldBorder.stopAdmin && isAdmin(event.player)) return;
    const {
        block: {
            location: { x, z },
        },
    } = event;
    if (Math.abs(x - centerX) > radius || Math.abs(z - centerZ) > radius) {
        event.cancel = true;
        system.run(() => event.player.sendMessage(`§bMatrix §7>§c ${lang(".Border.interact")}`));
    }
};

const playerInteractEntity = (event: PlayerInteractWithEntityBeforeEvent) => {
    if (c().worldBorder.stopAdmin && isAdmin(event.player)) return;
    const {
        target: {
            location: { x, z },
        },
    } = event;
    if (Math.abs(x - centerX) > radius || Math.abs(z - centerZ) > radius) {
        event.cancel = true;
        system.run(() => event.player.sendMessage(`§bMatrix §7>§c ${lang(".Border.interact")}`));
    }
};

let id: number;

export default {
    enable() {
        id = system.runInterval(worldBorder, c().worldBorder.checkEvery);
        world.beforeEvents.playerBreakBlock.subscribe(blockCancel);
        world.beforeEvents.playerPlaceBlock.subscribe(blockCancel);
        world.beforeEvents.playerInteractWithBlock.subscribe(playerInteractBlock);
        world.beforeEvents.playerInteractWithEntity.subscribe(playerInteractEntity);
    },
    disable() {
        lastSafePos.clear();
        system.clearRun(id);
        world.beforeEvents.playerBreakBlock.subscribe(blockCancel);
        world.beforeEvents.playerPlaceBlock.subscribe(blockCancel);
        world.beforeEvents.playerInteractWithBlock.subscribe(playerInteractBlock);
        world.beforeEvents.playerInteractWithEntity.subscribe(playerInteractEntity);
    },
};
