import * as Minecraft from "@minecraft/server";
import { c, isAdmin } from "../../Assets/Util";
import { system } from "@minecraft/server";

export function verifier(player: Minecraft.Player, setting: CommandConfig) {
    if (setting.enabled !== true) {
        return false;
    } else if (setting.adminOnly === true && !isAdmin(player)) {
        return false;
    } else if (setting.requireTag.length > 0 && !player.getTags().some((tag) => setting.requireTag.includes(tag))) {
        return false;
    }
    return true;
}

interface CommandConfig {
    enabled: boolean;
    adminOnly: boolean;
    requireTag: string[];
}
const commands: CommandProperties[] = [];

/**
 * @author jasonlaubb
 * @description Simple and useful command handler to handle different command and subcommand
 */
export function registerCommand(command: CommandHandleData, ...subCommand: CommandHandleData[]) {
    if (!command) throw new Error("registerCmd :: Command is not defined");
    const save: CommandProperties = {
        name: command.name,
        description: command.description,
        executor: null,
        subCommand: [],
        require: command?.require,
        requireSupportPlayer: command?.requireSupportPlayer,
    };
    if (command?.parent === true) {
        if (subCommand.length == 0) throw new Error("regsiterCmd :: Parent command must have sub command");
        subCommand.forEach((subCommand) => {
            save.subCommand.push({
                name: subCommand.name,
                description: subCommand.description,
                executor: subCommand.executor,
                subCommand: [],
                minArgs: subCommand?.minArgs,
                maxArgs: subCommand?.maxArgs,
            });
        });
        commands.push(save);
    } else {
        save.executor = command.executor;
        save.argRequire = command?.argRequire;
        save.minArgs = command?.minArgs;
        save.maxArgs = command?.maxArgs;
        if (!command.executor || command.argRequire?.length == 0) throw new Error("registerCmd :: Unhandled command properties");
        commands.push(save);
    }
}

export function triggerCommand(player: Minecraft.Player, message: string): number {
    const config = c();
    let isCommand = false;
    for (const prefix of [config.commands.prefix, ...config.otherPrefix]) {
        if (message.startsWith(prefix)) {
            message = message.slice(prefix.length).trim();
            isCommand = true;
            break;
        }
    }
    if (!isCommand) throw new Error("triggerCmd :: Unhandled command usage");
    const args = message.match(/"[^"]+"|[^\s]+/g).map((arg) => arg.replace(/"(.+)"/, "$1").toString());
    const command = args.shift().toLowerCase();

    const targetCommand = commands.find(({ name }) => name == command);
    if (!targetCommand || (targetCommand.require && !targetCommand.require(player)))
        return system.run(() => {
            sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "commands.generic.unknown", with: [args[0] ?? " "] });
        });
    if (targetCommand.subCommand) {
        if (args.length < 2) {
            return system.run(() => sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "commands.generic.syntax", with: [command, "", ""] }));
        }
        const subCommand = targetCommand.subCommand.find(({ name }) => name == args[1]);
        if (!subCommand) {
            const last = args.length > 1 ? args.slice(1).join(" ") : "";
            return system.run(() => sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "commands.generic.syntax", with: [command, args[0], last] }));
        }
        syntaxRun(subCommand, player, args.slice(1), `${command} ${args[0]} `);
    } else {
        syntaxRun(targetCommand, player, args, `${command} `);
    }
    return 0;
}

export function syntaxRun(targetCommand: CommandProperties, player: Minecraft.Player, args: string[], before: string = ""): number {
    if (targetCommand.minArgs && args.length < targetCommand.minArgs) {
        return system.run(() => sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "commands.generic.syntax", with: [before + args.join(" "), "", ""] }));
    }
    if (targetCommand.maxArgs && args.length > targetCommand.maxArgs) {
        return system.run(() => sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "commands.generic.syntax", with: [before + args.slice(0, targetCommand.maxArgs).join(" ") + " ", args.slice(targetCommand.maxArgs).join(" "), ""] }));
    }
    if (targetCommand.argRequire) {
        for (let i = 0; i < targetCommand.argRequire.length; i++) {
            if (!targetCommand.argRequire[i] || !args[i]) continue;
            if (!targetCommand.argRequire[i](args[i], targetCommand.requireSupportPlayer ? player : undefined, targetCommand.requireSupportArgs ? args : undefined)) {
                return system.run(() => sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "commands.generic.syntax", with: [before + args.slice(0, i).join(" ") + " ", args[i], args.slice(i + 1).join(" ")] }));
            }
        }
    }
    // Run the command and catch the unexpected error
    system.run(async () =>
        await targetCommand
            .executor(player, args)
            .catch(error)
    );

    return 0;
}

export function sendRawText(player: Minecraft.Player | Minecraft.World, ...message: Minecraft.RawMessage[]): void {
    return player.sendMessage({ rawtext: message });
}

function error (error: string) {
    player.sendMessage(`§bMatrix §7>§c Error:\n"` + JSON.stringify(error))
}

export function isPlayer(player: string, exclude: boolean = false, isadmin: boolean = null): Minecraft.Player {
    if (player.startsWith("@")) player.slice(1);
    const target = Minecraft.world.getPlayers({
        name: player,
    })[0];
    if (!target) return undefined;
    if (exclude && target.name == player) return undefined;
    if (isadmin != null && isadmin != isAdmin(target)) return undefined;
    return target;
}

export function onStart() {
    // Log the command amount
    system.runTimeout(() => console.log("CommandHandler :: Successfully registered " + commands.length + " application command(s)"), 20);
}

interface CommandHandleData {
    name: string;
    description: string;
    parent?: boolean;
    require?: (player: Minecraft.Player) => boolean;
    argRequire?: ((value: unknown, player?: Minecraft.Player, args?: string[]) => boolean)[];
    requireSupportPlayer?: boolean;
    requireSupportArgs?: boolean;
    minArgs?: number;
    maxArgs?: number;
    executor?: (player: Minecraft.Player, args: string[]) => Promise<void>;
}
interface CommandProperties {
    name: string;
    description: string;
    executor: null | ((player: Minecraft.Player, args: string[]) => Promise<void>);
    require?: (player: Minecraft.Player) => boolean;
    argRequire?: ((value: unknown, player?: Minecraft.Player, args?: string[]) => boolean)[];
    subCommand: CommandProperties[];
    requireSupportPlayer?: boolean;
    requireSupportArgs?: boolean;
    minArgs?: number;
    maxArgs?: number;
}
