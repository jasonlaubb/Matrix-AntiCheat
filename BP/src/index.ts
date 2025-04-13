import { world, system } from "@minecraft/server";
import { Command } from "./handler/command.ts";
export function config () {
    //unfinished
    return {};
}
system.beforeEvents.startup.subscribe((event) => {
    const requireEnums = Command.requireEnum;
    const registries = Command.registry;
    for (const [customCommand, callback] of registries) {
        event.registerCommand(customCommand, callback);
    }
    for (const [name, string] of requireEnums) {
        event.registerEnum(name, string);
    }
});
