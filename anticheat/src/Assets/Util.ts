import {
    world,
    Player,
    GameMode,
    EntityInventoryComponent,
    ItemEnchantsComponent,
    EntityDamageCause
} from "@minecraft/server"
import { ban } from "../Functions/moderateModel/banHandler";
import config from "../Data/Config";
import { triggerEvent } from "../Functions/moderateModel/eventHandler";
import { MinecraftItemTypes, MinecraftEnchantmentTypes } from "../node_modules/@minecraft/vanilla-data/lib/index";

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
                //@ts-expect-error
                player.threwTridentAt = Date.now();
            }
        }
    }
});

world.afterEvents.entityHurt.subscribe(event => {
    const player = event.hurtEntity;
    if (player instanceof Player && (event.damageSource.cause == EntityDamageCause.blockExplosion || event.damageSource.cause == EntityDamageCause.entityExplosion || event.damageSource.cause === EntityDamageCause.entityAttack)) {
        //@ts-expect-error
        player.lastExplosionTime = Date.now();
    }
});

export function kick (player: Player, reason?: string, by?: string) {
    try {
        player.runCommand(`kick "${player.name}" \n§2§l§¶Matrix >§4 ${player.name} §mYou have been kicked\n§fReason: §c${reason ?? 'No reason provided'}\n§fBy: §c${by ?? 'Unknown'}`)
    } catch {
        triggerEvent (player, "matrix:kick")
    }
}

function formatInformation (arr: string[]) {
    const formattedArr: string[] = arr.map(item => {
      const [key, value] = item.split(":");
      return `§r§l§¶${key}:§c ${value}§r`;
    });
    return formattedArr.join("\n");
}

let Vl: any = {};

export function flag (player: Player, modules: string, maxVL: number,  punishment?: string, infos?: string[]) {
    if (Vl[player.id] === undefined) {
        Vl[player.id] = {}
    }
    if (Vl[player.id][modules] === undefined) {
        Vl[player.id][modules] = 0
    }

    let vl = ++Vl[player.id][modules]
    if (vl > 99) vl = 99

    let flagMsg = `§2§l§¶Matrix >§4 ${player.name}§m has failed ${modules}§r §7[§cx${vl}§7]§r`
    if (infos !== undefined) flagMsg = flagMsg + "\n" + formatInformation(infos)

    const flagMode = world.getDynamicProperty("flagMode") ?? config.flagMode
    switch (flagMode) {
        case "tag": {
            world.getPlayers({ tags: ["matrix:notify"]}).forEach(players => players.sendMessage(flagMsg))
            break
        }
        case "bypass": {
            world.getPlayers({ excludeNames: [player.name] }).forEach(players => players.sendMessage(flagMsg))
            break
        }
        case "admin": {
            world.getAllPlayers().filter(players => isAdmin(players)).forEach(players => players.sendMessage(flagMsg))
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
    const timeUnits = {
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
            //@ts-expect-error
            ms += parseInt(match[1]) * timeUnits[unit];
        }
    }

    return ms;
}

export function isTimeStr(timeStr: string) {
    const timeUnits = ['d', 'h', 'm', 's'];
    return timeUnits.some(unit => new RegExp(`\\d+${unit}`).test(timeStr));
}
