import { world, Player, system } from "@minecraft/server";
import { msToTime, isHost, isAdmin, c } from "../../Assets/Util";
import { Action } from "../../Assets/Action";
import { BanqueueData } from "../chatModel/Commands/moderations/banqueue";

interface BanInfo {
    reason: string;
    by: string;
    time: number | "forever";
}

function checksBan(player: Player): void {
    const info = player.getDynamicProperty("isBanned");

    const baninfo: BanInfo | any = info === undefined ? undefined : JSON.parse(info as string);

    const unbanListingString = world.getDynamicProperty("unbanListing") as string;
    const unbanListing: string[] = unbanListingString ? JSON.parse(unbanListingString) : [];

    if (unbanListing.includes(player.name)) {
        world.setDynamicProperty("unbanListing", JSON.stringify(unbanListing.filter((name) => name !== player.name)));
        player.setDynamicProperty("isBanned", undefined);
        return;
    }

    if (baninfo === undefined) {
        const banqueue: BanqueueData[] = JSON.parse((world.getDynamicProperty("banqueue") as string) ?? "[]");
        const queuedata = banqueue.find(({ name }) => name == player.name);
        if (queuedata) {
            Action.ban(player, queuedata.reason, queuedata.admin, queuedata.time);
            world.setDynamicProperty("banqueue", JSON.stringify(banqueue.filter(({ name }) => name != player.name)));
        }
        return;
    }

    let reason;
    let by;
    let time;

    try {
        reason = baninfo.reason;
        by = baninfo.by;
        time = baninfo.time;
    } catch {
        console.log("baninfo is not a BanInfo object, unbanned");
        player.setDynamicProperty("isBanned", undefined);
    }

    if (time !== "forever") {
        if (Date.now() > time) {
            player.setDynamicProperty("isBanned", undefined);
            return;
        }
    }

    const timeLeft = time === "forever" ? "forever" : msToTime(time - Date.now());
    let timeTherShold: any;
    if (timeLeft === "forever") {
        timeTherShold = "forever";
    } else {
        const { days: d, hours: h, minutes: m, seconds: s } = timeLeft;
        timeTherShold = `${d} days, ${h} hours, ${m} minutes, ${s} seconds`;
    }
    const extraMessages = c().banModify.extraMessages as string[];
    const extraString =
        extraMessages.length > 0
            ? extraMessages
                  .map((string) => {
                      const [key, value] = string.split(":");
                      return `§7${key}: §c${value}`;
                  })
                  .join("\n")
            : "";
    try {
        player.runCommand(`kick "${player.name}" §r\n§c§lYour have been banned!\n§r§7Time Left:§c ${timeTherShold}\n§7Reason: §c${reason}§r\n§7By: §c${by}${extraString}`);
    } catch {
        Action.tempkick(player);
    }
}

function ban(player: Player, reason: string, by: string, time: number | "forever") {
    if (isHost(player) || isAdmin(player)) return;
    // Prevent if the player is lately banned (negative time)
    if (time != "forever" && time < Date.now()) return;
    system.run(() => {
        player.setDynamicProperty(
            "isBanned",
            JSON.stringify({
                reason: reason,
                by: by,
                time: time,
            } as BanInfo)
        );
        checksBan(player);
    });
}

function unban(playerName: string) {
    const unbanListingString = world.getDynamicProperty("unbanListing") as string;
    const unbanListing: string[] = unbanListingString ? JSON.parse(unbanListingString) : [];

    system.run(() => world.setDynamicProperty("unbanListing", JSON.stringify([...unbanListing, playerName])));
}

function unbanRemove(playerName: string) {
    const unbanListingString = world.getDynamicProperty("unbanListing") as string;
    const unbanListing: string[] = unbanListingString ? JSON.parse(unbanListingString) : [];
    if (!unbanListing.includes(playerName)) return false;
    system.run(() => world.setDynamicProperty("unbanListing", JSON.stringify(unbanListing.filter((name) => name !== playerName))));
    return true;
}

function unbanList() {
    const unbanListingString = world.getDynamicProperty("unbanListing") as string;
    return unbanListingString ? JSON.parse(unbanListingString) : [];
}

world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
    if (!initialSpawn) return;
    checksBan(player);
});

export { ban, unban, unbanRemove, unbanList };
