import { c, isAdmin, rawstr } from "../../../../Assets/Util";
import { registerCommand } from "../../CommandHandler";
import { recoverChanges, commitChanges } from "../../../Config/config_database";

registerCommand(
    {
        name: "configdb",
        description: "Manage config database function",
        parent: true,
        require: (player) => isAdmin(player),
    },
    {
        name: "commit",
        description: "Commit the changes to the database",
        maxArgs: 0,
        minArgs: 0,
        executor: async (player, _args) => {
            const config = c();
            if (config.configDataBase.autoCommit) return player.sendMessage(new rawstr(true, "c").tra("configdb.autocommit").parse());
            commitChanges(true);
            player.sendMessage(new rawstr(true, "g").tra("configdb.commit").parse());
        },
    },
    {
        name: "recover",
        description: "Recover the config database",
        maxArgs: 0,
        minArgs: 0,
        executor: async (player, _args) => {
            const config = c();
            if (config.configDataBase.autorecover) return player.sendMessage(new rawstr(true, "c").tra("configdb.autorecover").parse());
            const now = Date.now();
            recoverChanges().then(() => {
                player.sendMessage(new rawstr(true, "g").tra("configdb.recover", (Date.now() - now).toString()).parse());
            });
        },
    },
    {
        name: "delete",
        description: "Delete the config database",
        maxArgs: 0,
        minArgs: 0,
        executor: async (player, _args) => {
            player.sendMessage("§l§cAcess Denied!§r§7 Sorry, you cannot use this command directly to delete the config database.");
        },
    },
    {
        name: "clear",
        description: "Clear the all confuse scoreboard",
        maxArgs: 0,
        minArgs: 0,
        executor: async (player, _args) => {
            player.sendMessage("§l§cAcess Denied!§r§7 Sorry, please remove all confuse scoreboard by changing the confuse value to 0.");
        },
    }
);
