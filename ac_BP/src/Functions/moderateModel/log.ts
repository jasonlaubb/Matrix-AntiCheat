import { Player, world, system } from "@minecraft/server";
import { c, rawstr } from "../../Assets/Util";
import { ActionFormData, FormCancelationReason } from "@minecraft/server-ui";
export { saveLog, sendLog };
function saveLog(type: string, subject: string, object: string = "§cNo object") {
    const config = c();
    let logData = JSON.parse((world.getDynamicProperty("log") as string) ?? JSON.stringify([])) as logObject[];
    if (logData.length >= config.logsettings.maxStorge) {
        // Remove the part which is not needed
        logData = logData.slice(0, logData.length - config.logsettings.maxStorge);
    }
    logData.push({
        type: type,
        subject: subject,
        object: object,
        time: Date.now(),
    });
    world.setDynamicProperty("log", JSON.stringify(logData));
}
async function sendLog(player: Player, currentPage: number = 0) {
    const config = c();
    const dataView = JSON.parse((world.getDynamicProperty("log") as string) ?? JSON.stringify([])) as logObject[];
    if (dataView.length == 0) return player.sendMessage(`§bMatrix §7>§g There has been no log yet`);
    let output = "";
    const startIndex = currentPage * config.logsettings.pageShows;
    const endIndex = startIndex + config.logsettings.pageShows;
    for (let i = startIndex; i < endIndex; i++) {
        const data = dataView[dataView.length - i - 1];
        if (!data) break;
        const date = new Date(data.time + config.logsettings.utc * 3600000);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();
        const formattedHour = hour < 10 ? `0${hour}` : hour;
        const formattedMinute = minute < 10 ? `0${minute}` : minute;
        const formattedSecond = second < 10 ? `0${second}` : second;

        const time = `${day}/${month}/${year}|${formattedHour}:${formattedMinute}:${formattedSecond}`;
        output += `§7[§e${data.type}§7][§e${time}§7] Subject: §e${data.subject}§r §7Object: §e${data.object}§r\n`;
    }
    // player.sendMessage(output);
    const maxPages = Math.ceil(dataView.length / config.logsettings.pageShows);
    const previousButtonActive = currentPage > 0 && maxPages > 1;
    const nextButtonActive = currentPage < maxPages - 1 && maxPages > 1;
    const ui = new ActionFormData()
        .title("Anti Cheat Log | Page " + (currentPage + 1) + " of " + maxPages + " | UTC " + (config.logsettings.utc == 0 ? "time" : config.logsettings.utc > 0 ? `+${config.logsettings.utc}` : `-${config.logsettings.utc}`))
        .body(output);
    if (previousButtonActive) ui.button("Previous Page", "textures/ui/arrow_left.png");
    if (nextButtonActive) ui.button("Next Page", "textures/ui/arrow_right.png");
    ui.button(rawstr.drt("ui.exit"), "textures/ui/redX1.png");
    //@ts-expect-error
    const result = await ui.show(player);
    if (result.canceled && result.cancelationReason == FormCancelationReason.UserBusy) {
        // Retry every 40 ticks
        system.runTimeout(() => sendLog(player, currentPage), 60);
        return;
    }
    if ((result.canceled && result.cancelationReason == FormCancelationReason.UserClosed) || result.selection == 2) return;
    if (previousButtonActive && !nextButtonActive) {
        if (result.selection == 1) return;
        sendLog(player, currentPage - 1);
    } else if (nextButtonActive && !previousButtonActive) {
        if (result.selection == 1) return;
        sendLog(player, currentPage + 1);
    } else if (nextButtonActive && previousButtonActive) {
        switch (result.selection) {
            case 0: {
                sendLog(player, currentPage - 1);
                break;
            }
            case 1: {
                sendLog(player, currentPage + 1);
                break;
            }
            case 2: {
                return;
            }
        }
    }
    // Nothing here :p
}
world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
    if (c().logsettings.logPlayerRegister && initialSpawn) saveLog("Join", player.name);
});
world.afterEvents.playerLeave.subscribe(({ playerName }) => {
    if (c().logsettings.logPlayerRegister) saveLog("Left", playerName);
});
interface logObject {
    type: string;
    subject: string;
    object: string;
    time: number;
}
