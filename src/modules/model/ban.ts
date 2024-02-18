import {
    world,
    Player,
    system,
    PlayerSpawnAfterEvent
} from "@minecraft/server";

import { lang } from "../../lib/language";
import { BanDataOption } from "../../data/interface";

function msToTime (ms: number) {
    const seconds = Math.trunc((ms / 1000) % 60);
    const minutes = Math.trunc((ms / 60000) % 60);
    const hours = Math.trunc((ms / 3600000) % 24);
    const days = Math.trunc(ms / 86400000);

    return { days, hours, minutes, seconds };
}

function checksBan (player: Player): void {
    const info = player.getDynamicProperty("isBanned")

    const baninfo: BanDataOption = info === undefined ? undefined : JSON.parse(info as string)

    const unbanListingString = world.getDynamicProperty("unbanListing") as string;
    const unbanListing: string[] = unbanListingString ? JSON.parse(unbanListingString) : [];

    if (unbanListing.includes(player.name)) {
        world.setDynamicProperty("unbanListing", JSON.stringify(unbanListing.filter(name => name !== player.name)))
        player.setDynamicProperty("isBanned", undefined)
        return
    }

    if (baninfo === undefined) return;

    let reason;
    let by;
    let time;

    try {
        reason = baninfo.reason;
        by = baninfo.by;
        time = baninfo.time;
    } catch {
        console.log("baninfo is not a BanInfo object, unbanned")
        player.setDynamicProperty("isBanned", undefined)
    }

    if (time !== "forever") {
        if (Date.now() > time) {
            player.setDynamicProperty("isBanned", undefined)
            return
        }
    }

    const timeLeft = time === "forever" ? "forever" : msToTime(time - Date.now())
    let timeTherShold: any;
    if (timeLeft === "forever") {
        timeTherShold = "forever"
    } else {
        const { days: d, hours: h, minutes: m, seconds: s } = timeLeft
        timeTherShold = `${d} days, ${h} hours, ${m} minutes, ${s} seconds`
    }

    player.runCommand(`kick "${player.name}" §r\n${lang(".banHandler.format", timeTherShold, reason, by)}`)
}

function ban (player: Player, reason: string, by: string, time: number | "forever") {
    system.run(() => {
        player.setDynamicProperty("isBanned", JSON.stringify({
            reason: reason,
            by: by,
            time: time
        } as BanDataOption))
        checksBan (player)
    })
}

function unban (playerName: string) {
    const unbanListingString = world.getDynamicProperty("unbanListing") as string;
    const unbanListing: string[] = unbanListingString ? JSON.parse(unbanListingString) : [];

    system.run(() => world.setDynamicProperty("unbanListing", JSON.stringify([...unbanListing, playerName])))
}

function unbanRemove (playerName: string) {
    const unbanListingString = world.getDynamicProperty("unbanListing") as string;
    const unbanListing: string[] = unbanListingString ? JSON.parse(unbanListingString) : [];
    if (!unbanListing.includes(playerName)) return false;
    system.run(() => world.setDynamicProperty("unbanListing", JSON.stringify(unbanListing.filter(name => name !== playerName))))
    return true
}

function unbanList () {
    const unbanListingString = world.getDynamicProperty("unbanListing") as string;
    return unbanListingString ? JSON.parse(unbanListingString) : [];
}

function playerSpawnAfterEvent ({ player, initialSpawn }: PlayerSpawnAfterEvent) {
    if (initialSpawn) checksBan(player)
}

export { playerSpawnAfterEvent, ban, unban, unbanRemove, unbanList }