import { Player, world } from "@minecraft/server";
import { c } from "../../Assets/Util";
import { ActionFormData } from "@minecraft/server-ui";
export { saveLog, sendLog };
function saveLog(type: string, subject: string, object: string = "§cNo object") {
    const config = c();
    const logData = JSON.parse((world.getDynamicProperty("log") as string) ?? JSON.stringify([])) as logObject[];
    if (logData.length >= config.logsettings.maxStorge) {
        // Remove the part which is not needed
        logData.slice(0, logData.length - config.logsettings.maxStorge);
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
    for (let i = currentPage * config.logsettings.pageShows; i <= config.logsettings.pageShows; i++) {
        const data = dataView[i];
        // if there is no more log, break
        if (!data) break;
        const date = new Date(data.time);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();
        const time = `${day}/${month}/${year}|${hour}:${minute}:${second}`;
        output += `§7[§e${data.type}§7][§e${time}§7] Subject: §e${data.subject}§r §7Object: §e${data.object}§r\n`;
    }
    const maxPages = Math.ceil(dataView.length / config.logsettings.pageShows);
    const previousButtonActive = currentPage > 0 && maxPages > 1;
    const nextButtonActive = currentPage < maxPages - 1 && maxPages > 1;
    const ui = new ActionFormData().title("Anti Cheat Log | Page " + (currentPage + 1) + " of " + maxPages).body(output);
    if (previousButtonActive) ui.button("Previous Page", "textures/ui/arrow.png");
    if (nextButtonActive) ui.button("Next Page", "textures/ui/arrow_left.png");
    ui.button("Close", "textures/ui/redX1.png");
    const result = await ui.show(player);
    if (result.canceled || result.selection == 2) return;
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
