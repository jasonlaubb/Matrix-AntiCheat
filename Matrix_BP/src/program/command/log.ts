import * as log from "../../assets/logSystem";
import { rawtextTranslate, fastText } from "../../util/rawtext";
import { day_ms, generateShortTimeStr, parseLogUserInterface, timeStringCorrectToDay, waitShowActionForm } from "../../util/util";
import { ActionFormData } from "@minecraft/server-ui";
import type { cmd } from "../../assets/cmd";
import { CustomCommandParamType, system } from "@minecraft/server";
export default [
    {
        cc: {
            name: "m:fastlog",
            description: "Get logs specific to a day.",
            permissionLevel: 2,
            mandatoryParameters: [
                {
                    name: "m:previousDay",
                    type: CustomCommandParamType.Enum,
                }
            ]
        },
        cb(player, previousDay) {
            system.run(() => {
            const selectedDay = previousDay as "today" | "yesterday" | "thedaybefore";
            const dayT = timeStringCorrectToDay(Date.now());
            switch (selectedDay) {
                case "yesterday": {
                    dayT.dayStart -= day_ms;
                    dayT.dayEnd -= day_ms;
                    break;
                }
                case "thedaybefore": {
                    dayT.dayStart -= day_ms * 2;
                    dayT.dayEnd -= day_ms * 2;
                    break;
                }
            }
            const logs = log.getLog(dayT.dayStart, dayT.dayEnd);
            if (logs.length === 0) return player.sendMessage(fastText().addText("§bMatrix§a+ §7> §c").addTran("command.log.nodata").build());
            parseLogUserInterface(logs, player);
            });
            return { status: 0 };
        },
        en: {
            id: "m:previousDay",
            items: ["today", "yesterday", "thedaybefore"],
        }
    },
    {
        cc: {
            name: "m:log",
            description: "Get logs of the server.",
            permissionLevel: 2,
            optionalParameters: [
                {
                    name: "amount",
                    type: CustomCommandParamType.Integer,
                }
            ]
        },
        cb(player, amount) {
            system.run(() => {
            const showAmount = (amount as number) ?? 80;
            if (showAmount <= 0) return player.sendMessage(rawtextTranslate("command.number.positive"));
            const logs = log.getAllLogs().slice(0, showAmount);
            if (logs.length === 0) return player.sendMessage(fastText().addText("§bMatrix§a+ §7> §c").addTran("command.log.nodata").build());
            parseLogUserInterface(logs, player);
            });
            return { status: 0 };
        }
    },
    {
        cc: {
            name: "m:logui",
            description: "Get logs of the server in a user interface.",
            permissionLevel: 2,
        },
        cb(player) {
            system.run(() => {
                const ui = new ActionFormData().title(rawtextTranslate("command.logui.title"));
                const restartLogs = log.getRestartLogs();
                restartLogs.forEach((log) => {
                    ui.button(
                        fastText()
                            .addTran("command.logui.button", log.amount)
                            .endline()
                            .addText("§8" + generateShortTimeStr(log.now))
                            .build()
                    );
                });
                waitShowActionForm(ui, player).then((result) => {
                    if (result === null) return;
                    const selection = result.selection!;
                    const startTime = restartLogs[selection].now;
                    const endTime = restartLogs[selection - 1] ? restartLogs[selection - 1].now - 1 : Date.now();
                    const logs = log.getLog(startTime, endTime);
                    if (logs.length === 0) return player.sendMessage(fastText().addText("§bMatrix§a+ §7> §c").addTran("command.log.nodata").build());
                    parseLogUserInterface(logs, player);
                });
            });
            return { status: 0 };
        }
    }
] as cmd[];