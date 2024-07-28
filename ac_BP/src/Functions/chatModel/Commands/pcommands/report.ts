import { saveLog } from "../../../moderateModel/log";
import { isPlayer, registerCommand, verifier } from "../../CommandHandler";
import { c } from "../../../../Assets/Util";

registerCommand({
    name: "report",
    description: "Report a player",
    parent: false,
    maxArgs: 2,
    minArgs: 1,
    requireSupportPlayer: true,
    require: (player) => verifier(player, c().commands.report),
    argRequire: [(value, player) => !!isPlayer(value as string, true, false, player), (value, _player) => (value as string).length > 3 && (value as string).length < 64],
    executor: async (player, args) => {
        const lastReportTime = (player.getDynamicProperty("lastReportTime") as number) ?? 0;
        const cooldown = c().commands.report.commandUsingCooldown;
        const now = Date.now();
        const timegole = now - lastReportTime;
        if (timegole < cooldown) {
            const timeleft = cooldown - timegole;
            player.sendMessage({
                rawtext: [{ text: "§bMatrix §7>§c " }, { translate: "report.cooldown", with: [timeleft.toFixed(1)] }],
            });
            return;
        }
        player.setDynamicProperty("lastReportTime", now);
        const target = args[0];
        const reason = args[1];
        const targetPlayer = isPlayer(target as string, true, false, player);
        saveLog("Report", targetPlayer.name, `Reported by ${player.name} for reason: ${reason ?? "--"}`);
    },
});
