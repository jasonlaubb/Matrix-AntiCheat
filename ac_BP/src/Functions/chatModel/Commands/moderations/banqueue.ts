import { registerCommand, sendRawText, verifier } from "../../CommandHandler";
import { c, isTimeStr, timeToMs } from "../../../../Assets/Util";
import { world } from "@minecraft/server";

registerCommand(
    {
        name: "banqueue",
        description: "Ban a player (offline)",
        parent: true,
        require: (player) => verifier(player, c().commands.banqueue),
    },
    {
        name: "add",
        description: "Add a player to ban queue",
        minArgs: 3,
        maxArgs: 3,
        argRequire: [(value) => (value as string).length >= 3 && (value as string).length <= 12, undefined, (value) => isTimeStr(value as string) || value == "forever"],
        executor: async (player, args) => {
            const reason = args[1];
            const time = args[2];
            //ban(target, reason, player.name, time === "forever" ? time : Date.now() + timeToMs(time));
            const banqueueData: BanqueueData = {
                name: args[0],
                reason: reason,
                time: time === "forever" ? time : Date.now() + timeToMs(time)!,
                admin: player.name,
            };
            const totalData: BanqueueData[] = JSON.parse((world.getDynamicProperty("banqueue") as string) ?? "[]");
            if (totalData.findIndex((data) => data.name == banqueueData.name) == -1) {
                sendRawText(world, { text: "§bMatrix §7>§g " }, { translate: "ban.has", with: [args[0], player.name] });
                totalData.push(banqueueData);
                world.setDynamicProperty("banqueue", JSON.stringify(totalData));
            } else {
                sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "banqueue.already" });
            }
        },
    },
    {
        name: "remove",
        description: "Remove a player from ban queue",
        minArgs: 1,
        maxArgs: 1,
        executor: async (player, args) => {
            const totalData: BanqueueData[] = JSON.parse((world.getDynamicProperty("banqueue") as string) ?? "[]");
            if (totalData.findIndex((data) => data.name == args[0]) == -1) {
                sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "banqueue.notfound" });
            } else {
                sendRawText(world, { text: "§bMatrix §7>§g " }, { translate: "banqueue.done" });
                totalData.splice(
                    totalData.findIndex((data) => data.name == args[0]),
                    1
                );
                world.setDynamicProperty("banqueue", JSON.stringify(totalData));
            }
        },
    },
    {
        name: "list",
        description: "List all players in ban queue",
        executor: async (player) => {
            const totalData: string[] = JSON.parse((world.getDynamicProperty("banqueue") as string) ?? "[]").map(({ name }: BanqueueData) => name);
            if (totalData.length == 0) {
                sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "banqueue.empty" });
            } else {
                sendRawText(player, { text: "§bMatrix §7>§g " }, { translate: "banqueue.list", with: [totalData.join(", ")] });
            }
        },
    }
);

export interface BanqueueData {
    name: string;
    reason: string;
    time: "forever" | number;
    admin: string;
}
