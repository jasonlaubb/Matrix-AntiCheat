import { world, system } from "@minecraft/server";
import { MinecraftEntityTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import { flag, isAdmin } from "../../Assets/Util";
import config from "../../Data/Config";
import lang from "../../Data/Languages/lang";

let killRate: number[] = []

world.beforeEvents.entityRemove.subscribe(({ removedEntity: entity }) => {
    const toggle: boolean = (world.getDynamicProperty("antiCBE") ?? config.antiCommandBlockExplolit.enabled) as boolean;

    //if toggle is disabled or the entity is not a command block minecart, return
    if (toggle !== true || entity.typeId !== MinecraftEntityTypes.CommandBlockMinecart) return

    const pos = entity.location

    //update the rate
    const now = Date.now()
    let rate = killRate.filter(time => now - time > 2000)
    rate.push(now)
    killRate = rate

    //prevent spam message if more than 1 command block minecart is killed in 2 seconds
    if (killRate.length > 1) return;

    //get the players around the command block minecart
    const player = entity.dimension.getPlayers({
        location: pos,
        maxDistance: 8.5,
        minDistance: 0
    })[0]

    //if no any player near the command block minecart or the player is admin, return
    if (player === undefined || isAdmin(player)) return

    //constant the distance between the player and the command block minecart
    const distance = Math.hypot(pos.x - player.location.x, pos.y - player.location.y, pos.z - player.location.z)

    //flag the player
    system.run(() =>
       flag(player, "CommandBlockExplolit", "A", config.antiCommandBlockExplolit.maxVL, config.antiCommandBlockExplolit.punishment, [lang(">distance") + ":" + distance.toFixed(2), lang(">Pos") + ":" + Math.floor(pos.x) + ", " + Math.floor(pos.y) + ", " + Math.floor(pos.z)])
    )
})