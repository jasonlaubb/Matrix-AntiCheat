import * as Minecraft from "@minecraft/server";
import { c, isAdmin, rawstr } from "../../Assets/Util";
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
            save.subCommand!.push({
                name: subCommand.name,
                description: subCommand.description,
                executor: subCommand.executor!,
                subCommand: undefined,
                minArgs: subCommand?.minArgs,
                maxArgs: subCommand?.maxArgs,
            });
        });
        commands.push(save);
    } else {
        save.executor = command.executor!;
        save.argRequire = command?.argRequire;
        save.minArgs = command?.minArgs;
        save.maxArgs = command?.maxArgs;
        save.subCommand = [];
        if (!command.executor) throw new Error("registerCmd :: Unhandled command properties");
        commands.push(save);
    }
}

export function triggerCommand(player: Minecraft.Player, message: string): number | void {
    const config = c();
    for (const prefix of [config.commands.prefix, ...config.otherPrefix]) {
        if (message.startsWith(prefix)) {
            message = message.slice(prefix.length).trim();
            break;
        }
    }
    if (message.replaceAll(" ", "").length == 0) return system.run(() => sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "commands.generic.unknown", with: [" "] }));
    const matches = message.match(/"((?:\\.|[^"\\])*)"|[^"@\s]+/g);
    if (matches === null) {
        return;
    }
    const args = matches.map((regax) => regax.replace(/^"(.*)"$/, "$1")?.replace(/\\"/g, '"'));
    const command = args.shift();
    // system.run(() => player.sendMessage(JSON.stringify(args) + "\n" + command));
    const targetCommand = commands.find(({ name }) => name == command);
    if (!targetCommand || (targetCommand.require && !targetCommand.require(player)))
        return system.run(() => {
            if (config.soundEffect) player.playSound("note.bass", { volume: 1.0 });
            sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "commands.generic.unknown", with: [command ?? " "] });
        });
    //player.sendMessage(JSON.stringify(targetCommand.subCommand))
    if (targetCommand.subCommand!.length > 0) {
        if (args.length == 0) {
            return system.run(() => {
                sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "commands.generic.syntax", with: [command!, "", ""] });
                if (config.soundEffect) player.playSound("note.bass", { volume: 1.0 });
            });
        }
        const subCommand = targetCommand.subCommand!.find(({ name }) => name == args[0]);
        if (!subCommand) {
            const last = args.length > 1 ? args.join(" ").slice(1) : "";
            return system.run(() => {
                if (config.soundEffect) player.playSound("note.bass", { volume: 1.0 });
                sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "commands.generic.syntax", with: [command!, args[0], last] });
            });
        }
        syntaxRun(subCommand, player, args.slice(1), `${command} ${args[0]} `);
    } else {
        syntaxRun(targetCommand, player, args, `${command} `);
    }
    return 0;
}

export function syntaxRun(targetCommand: CommandProperties, player: Minecraft.Player, args: string[], before: string = ""): number {
    const config = c();
    if (targetCommand.minArgs && args.length < targetCommand.minArgs) {
        return system.run(() => {
            if (config.soundEffect) player.playSound("note.bass", { volume: 1.0 });
            sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "commands.generic.syntax", with: [before + args.join(" "), "", ""] });
        });
    } else if (targetCommand.maxArgs && args.length > targetCommand.maxArgs) {
        if (config.soundEffect) player.playSound("note.bass", { volume: 1.0 });
        return system.run(() => {
            if (config.soundEffect) player.playSound("note.bass", { volume: 1.0 });
            sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "commands.generic.syntax", with: [before + args.slice(0, targetCommand.maxArgs).join(" ") + " ", args.slice(targetCommand.maxArgs).join(" "), ""] });
        });
    } else if (targetCommand.argRequire) {
        for (let i = 0; i < targetCommand.argRequire.length; i++) {
            if (!targetCommand.argRequire[i] || !args[i]) continue;
            if (!targetCommand.argRequire[i]!(args[i], targetCommand.requireSupportPlayer ? player : undefined, targetCommand.requireSupportArgs ? args : undefined)) {
                return system.run(() => {
                    if (config.soundEffect) player.playSound("note.bass", { volume: 1.0 });
                    sendRawText(player, { text: "§bMatrix §7>§c " }, { translate: "commands.generic.syntax", with: [before + args.slice(0, i - 1).join(" ") + " ", args[i], args.slice(i + 1).join(" ")] });
                });
            }
        }
    }
    // Run the command and catch the unexpected error
    system.run(async () => await targetCommand.executor!(player, args).catch((err) => error(player, err)));

    return 0;
}
export function sendRawText(player: Minecraft.Player | Minecraft.World, ...message: Minecraft.RawMessage[]): void {
    return player.sendMessage({ rawtext: message });
}

export function error(target: Minecraft.Player | Minecraft.World, { name, message, stack }: Error): void {
    const rawmessage = new rawstr(true, "g").tra("cmderror.title").str("\n").tra("cmderror.name", name).str("\n").tra("cmderror.message", message).str("\n").tra("cmderror.stack", stack ?? "Unknown");

    target.sendMessage(rawmessage.parse());
}
export function sendErr(err: Error) {
    console.warn(`${err.name}: ${err.message}\n    at ${err?.stack ?? "unknown"}`);
}

export function isPlayer(player: string, exclude: boolean = false, isadmin: boolean | string = "no la", runner?: Minecraft.Player): Minecraft.Player {
    if (player.startsWith("@")) player.slice(1);
    const target = Minecraft.world.getPlayers({
        name: player,
    })[0];
    if (!target) {
        system.run(() => console.warn(`Query :: Player ${player} not found`));
        return undefined!;
    }
    if (exclude && runner && target.name == runner.name) {
        system.run(() => console.warn(`Query :: Player ${player} same as command runner`));
        return undefined!;
    }
    if (isadmin != "no la" && isadmin != isAdmin(target)) {
        system.run(() => console.warn(`Query :: Player ${player} not match admin status`));
        return undefined!;
    }
    return target;
}
export function getAllCommandNames() {
    return commands.map(({ name }) => name);
}

interface CommandHandleData {
    name: string;
    description: string;
    parent?: boolean;
    require?: (player: Minecraft.Player) => boolean;
    argRequire?: (undefined | ((value: unknown, player?: Minecraft.Player, args?: string[]) => boolean))[];
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
    argRequire?: (undefined | ((value: unknown, player?: Minecraft.Player, args?: string[]) => boolean))[];
    subCommand: CommandProperties[] | undefined;
    requireSupportPlayer?: boolean;
    requireSupportArgs?: boolean;
    minArgs?: number;
    maxArgs?: number;
}
