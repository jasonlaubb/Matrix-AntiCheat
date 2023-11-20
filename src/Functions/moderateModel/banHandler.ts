import {
    world,
    Player,
    system
} from "@minecraft/server";
import { msToTime } from "../../Assets/Util";
import lang from "../../Data/Languages/lang";
import { triggerEvent } from "./eventHandler";

class BanInfo {
    isBanned: boolean;
    reason: string;
    by: string;
    time: number | "forever";
}

function checksBan (player: Player): void {
    const info = player.getDynamicProperty("isBanned")

    const baninfo: BanInfo | any = info === undefined ? undefined : JSON.parse(info as string)

    const unbanListing: string[] = JSON.parse(world.getDynamicProperty("unbanListing") as string ?? JSON.stringify([]))

    if (unbanListing.includes(player.name)) {
        world.setDynamicProperty("unbanListing", JSON.stringify(unbanListing.filter(name => name !== player.name)))
        player.setDynamicProperty("isBanned", undefined)
        return
    }

    if (baninfo === undefined) return;

    const { reason, by, time }: BanInfo = baninfo

    if (time !== "forever") {
        if (Date.now() > time) {
            player.setDynamicProperty("isBanned", undefined)
            return
        }
    }

    const timeLeft = time === "forever" ? "forever" : msToTime(time - Date.now())
    let timeTherShold;
    if (timeLeft === "forever") {
        timeTherShold = "forever"
    } else {
        const { days: d, hours: h, minutes: m, seconds: s } = timeLeft
        timeTherShold = `${d} days, ${h} hours, ${m} minutes, ${s} seconds`
    }

    try {
        player.runCommand(`kick "${player.name}" "\n§c§l${lang(".banHandler.banned")}${lang(".banHandler.format").replace("%a", timeTherShold).replace("%b", reason).replace("%c", by)}\n§r§7${lang(".Util.reason")}: §c${reason}\n§7${lang(".Util.by")}: §c${by}\n§7${lang(".Util.timeLeft")}: §c${timeTherShold}\n§7${lang(".Util.unknown")}: §c${lang(".Util.has_failed")}\n§r§7${lang(".Util.unknown")}: §c${lang(".Util.has_failed")}\n§r§7${lang(".Util.unknown")}: §c${lang(".Util.has_failed")}\n§r§7${lang(".Util.unknown")}: §c${lang(".Util.has_failed")}\n§r§7${lang(".Util.unknown")}: §c${lang(".Util.has_failed")}\n§r§7${lang(".Util.unknown")}: §c${lang(".Util.has_failed")}\n§r§7${lang(".Util.unknown")}: §c${lang(".Util.has_failed")}\n§r§7${lang(".Util.unknown")}: §c${lang(".Util.has_failed")}\n§r§7${lang(".Util.unknown")}: §c${lang(".Util.has_failed")}\n§r§7${lang(".Util.unknown")}: §c${lang(".Util.has_failed")})}`)
    } catch {
        triggerEvent (player, "matrix:kick")
    }
}

function ban (player: Player, reason: string, by: string, time: number | "forever") {
    system.run(() => {
        player.setDynamicProperty("isBanned", JSON.stringify({
            isBanned: true,
            reason,
            by,
            time
        }))
        checksBan (player)
    })
}

function unban (playerName: string) {
    const unbanListing: string[] = JSON.parse(world.getDynamicProperty("unbanListing") as string)

    system.run(() => world.setDynamicProperty("unbanListing", JSON.stringify([...unbanListing, playerName])))
}

function unbanRemove (playerName: string) {
    const unbanListing: string[] = JSON.parse(world.getDynamicProperty("unbanListing") as string)
    if (!unbanListing.includes(playerName)) return false;
    system.run(() => world.setDynamicProperty("unbanListing", JSON.stringify(unbanListing.filter(name => name !== playerName))))
    return true
}

function unbanList () {
    return JSON.parse(world.getDynamicProperty("unbanListing") as string ?? "[]")
}

world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
    if (!initialSpawn) return;
    checksBan(player)
})

export { ban, unban, unbanRemove, unbanList }