import {
    world,
    Player,
    GameMode,
    EntityInventoryComponent,
    ItemEnchantsComponent,
    EntityDamageCause,
    Vector3,
    Dimension
} from "@minecraft/server"
import { ban } from "../Functions/moderateModel/banHandler";
import config from "../Data/Config";
import { triggerEvent } from "../Functions/moderateModel/eventHandler";
import { MinecraftItemTypes, MinecraftEnchantmentTypes, MinecraftBlockTypes } from "../node_modules/@minecraft/vanilla-data/lib/index";
import lang from "../Data/Languages/lang";

world.afterEvents.itemReleaseUse.subscribe(({ itemStack, source: player }) => {
    if (itemStack?.typeId === MinecraftItemTypes.Trident && player instanceof Player) {
        const getItemInSlot = (
            player.getComponent(
                EntityInventoryComponent.componentId
            ) as EntityInventoryComponent
        ).container.getItem(player.selectedSlot);
        if (getItemInSlot === undefined) return;
        const getEnchantment = (
            getItemInSlot.getComponent(
                ItemEnchantsComponent.componentId
            ) as ItemEnchantsComponent
        ).enchantments;
        if (getItemInSlot.typeId == MinecraftItemTypes.Trident) {
            const checkRipTide = getEnchantment.hasEnchantment(
                MinecraftEnchantmentTypes.Riptide
            );
            if (checkRipTide) {
                player.threwTridentAt = Date.now();
            }
        }
    }
});

world.afterEvents.entityHurt.subscribe(event => {
    const player = event.hurtEntity;
    if (player instanceof Player && (event.damageSource.cause == EntityDamageCause.blockExplosion || event.damageSource.cause == EntityDamageCause.entityExplosion || event.damageSource.cause === EntityDamageCause.entityAttack)) {
        player.lastExplosionTime = Date.now();

        if (world.getDynamicProperty("antiFly") ?? config.antiFly.enabled) {
            if (!player.hasTag("matrix:knockback")) {
                player.addTag("matrix:knockback")
            } else if (player.getVelocity().y <= 0) {
                player.removeTag("matrix:knockback")
            }
        }
    }
});

export function kick (player: Player, reason?: string, by?: string) {
    try {
        player.runCommand(`kick "${player.name}" \n§bMatrix §7> §b ${player.name} §m${lang(".Util.kicked")}\n§f${lang(".Util.reason")}: §c${reason ?? lang(".Util.noreason")}\n§fBy: §c${by ?? lang(".Util.unknown")})}`)
    } catch {
        triggerEvent (player, "matrix:kick")
    }
}

export function formatInformation (arr: string[]) {
    const formattedArr: string[] = arr.map(item => {
      const [key, value, id] = item.split(":");
      return `§r§c» §7${key}:§9 ${value}${id == undefined ? '' : ':' + id}§r`;
    });
    return formattedArr.join("\n");
}

export function checkBlockAround (location: Vector3, blockType: MinecraftBlockTypes, dimension: Dimension): boolean {
    const floorPos: Vector3 = {
        x: Math.floor(location.x),
        y: Math.floor(location.y) - 1,
        z: Math.floor(location.z)
    } as Vector3

    let blocks: string[] = []

    for (let x = -1; x <= 1; x++) {
        for (let z = -1; z <= 1; z++) {
            blocks.push(dimension.getBlock({ x: floorPos.x + x, y: floorPos.y, z: floorPos.z + z } as Vector3)?.typeId)
        }
    }

    return new Set(blocks).has(blockType)
}

let Vl: any = {};

type Type = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I"

export function flag (player: Player, modules: string, type: Type, maxVL: number, punishment: string | undefined, infos: string[] | undefined) {
    if (Vl[player.id] === undefined) {
        Vl[player.id] = {}
    }
    if (Vl[player.id][modules] === undefined) {
        Vl[player.id][modules] = 0
    }

    let vl = ++Vl[player.id][modules]
    if (vl > 99) vl = 99

    let flagMsg = `§bMatrix §7> §c ${player.name}§g ` + lang(".Util.has_failed") + ` §4${modules}§r §7[§c${lang(">Type")} ${type}§7] §7[§dx${vl}§7]§r`
    if (infos !== undefined) flagMsg = flagMsg + "\n" + formatInformation(infos)

    const flagMode = world.getDynamicProperty("flagMode") ?? config.flagMode
    switch (flagMode) {
        case "tag": {
            const targets = world.getPlayers({ tags: ["matrix:notify"]})
            targets.forEach(players => players.sendMessage(flagMsg))
            break
        }
        case "bypass": {
            const targets = world.getPlayers({ excludeNames: [player.name] })
            targets.forEach(players => players.sendMessage(flagMsg))
            break
        }
        case "admin": {
            const targets = world.getAllPlayers().filter(players => isAdmin(players))
            targets.forEach(players => players.sendMessage(flagMsg))
            break
        }
        default: {
            world.sendMessage(flagMsg)
            break
        }
    }
    
    if (punishment && vl > maxVL) {
        let punishmentDone = false
        switch (punishment) {
            case "kick": {
                punishmentDone = true
                kick (player, config.punishment_kick.reason, 'Matrix')
                break
            }
            case "ban": {
                punishmentDone = true
                ban (player, config.punishment_ban.reason, "Matrix", Date.now() + (config.punishment_ban.minutes * 60000))
                break
            }
            default: {
                break
            }
        }
        if (punishmentDone) {
            Vl[player.id][modules] = 0
        }
    }
}

export function msToTime (ms: number) {
    const seconds = Math.trunc((ms / 1000) % 60);
    const minutes = Math.trunc((ms / 60000) % 60);
    const hours = Math.trunc((ms / 3600000) % 24);
    const days = Math.trunc(ms / 86400000);

    return { days, hours, minutes, seconds };
}

export function isTargetGamemode (player: Player, gamemode: number) {
    const gamemodes: GameMode[] = [
        GameMode.survival,
        GameMode.creative,
        GameMode.adventure,
        GameMode.spectator
    ]

    return world.getPlayers({ name: player.name, gameMode: gamemodes[gamemode] }).length > 0
}

export function getGamemode (playerName: string) {
    const gamemodes: GameMode[] = [
        GameMode.survival,
        GameMode.creative,
        GameMode.adventure,
        GameMode.spectator
    ]

    for (let i = 0; i < 4; i++) {
        if (world.getPlayers({
            name: playerName,
            gameMode: gamemodes[i]
        }).length > 0) return i
    }

    return 0
}

export function isAdmin (player: Player) {
    return !!player.getDynamicProperty("isAdmin")
}

export function timeToMs(timeStr: string) {
    const timeUnits: { [key: string]: number } = {
        d: 86400000,
        h: 3600000,
        m: 60000,
        s: 1000
    };

    let ms = 0;
    let match;

    for (const unit in timeUnits) {
        match = timeStr.match(new RegExp(`(\\d+)${unit}`));
        if (match) {
            ms += parseInt(match[1]) * timeUnits[unit];
        }
    }

    return ms;
}

export function isTimeStr(timeStr: string) {
    const timeUnits = ['d', 'h', 'm', 's'];
    return timeUnits.some(unit => new RegExp(`\\d+${unit}`).test(timeStr));
}
