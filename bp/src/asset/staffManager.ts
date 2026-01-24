import { Player, system, world } from "@minecraft/server";
import { get } from "../util/database";
import { text } from "../util/text";

export function checkStaffChatCommand (player: Player, message: string) {
    const prefix = get("chatCommandPrefix");
    if (!message.startsWith(prefix)) return false;
    const command = message.slice(prefix.length).trim();
    if (command.length === 0) return false;
    const role = player.getDynamicProperty("staff") as string;
    if (!role) throw new Error("staffManager :: Unexpected no role found for staff chat command.");
    const roleData = world.getDynamicProperty(`role:${role}`) as string;
    if (!roleData) {
        player.sendMessage(`§7[§aMatrix§7] §c${text("staffcmdNoPerm")}`);
        return true;
    }
    if (!roleData.split(";").some((allowedCmd) => command.split(" ")[0] === allowedCmd)) {
        return true;
    }
    player.lastRunUICommand = true; // Show feedback in command output
    system.run(() => {
        try {
            player.runCommand(command);
        } catch (error) {
            const { name, message } = error as Error;
            player.sendMessage(`§7[§aMatrix§7] §c${name}: ${message}`);
        }
    });
    return true;
}