import { c, rawstr } from "../../../../Assets/Util";
import { registerCommand, verifier } from "../../CommandHandler";
import { system } from "@minecraft/server";

registerCommand({
    name: "ping",
    description: "Pong! Let anticheat gives you the current server pings.",
    parent: false,
    maxArgs: 0,
    minArgs: 0,
    require: (player) => verifier(player, c().commands.ping),
    executor: async (player, _args) => {
        player.sendMessage(new rawstr(true, "g").tra("ping.ping", player.name).parse());
        const ping = await whatIsThePing();
        let pingLevel = ping < 40 ? "§aLow" : ping < 120 ? "§eAverge" : ping < 300 ? "§gMid" : ping < 800 ? "§cHigh" : "§dExtreme";
        player.sendMessage(new rawstr(true, "g").tra("ping.pong", ping.toString(), pingLevel).parse());
    },
});
/** @description Function to get the server ping .u. */
function whatIsThePing(): Promise<number> {
    const currentTime = Date.now();
    return new Promise<number>((pong) => {
        system.run(() => {
            const now = Date.now();
            const ping = Math.abs(now - currentTime - 50);
            pong(ping);
        });
    });
}
