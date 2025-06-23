import { CustomCommand, CustomCommandOrigin, CustomCommandResult, Player, system } from "@minecraft/server";
export interface cmd {
    cc: CustomCommand;
    cb: (origin: Player, ...args: any[]) => CustomCommandResult | undefined;
    en?: {
        id: string;
        items: string[];
    }
}
import about from "../program/command/about";
import set from "../program/command/set";
system.beforeEvents.startup.subscribe((event) => {
    const commands: cmd[] = [
        about,
        ...set,
    ];
    const registery = event.customCommandRegistry;
    commands.forEach(({ cc, cb, en }) => {
        if (en) registery.registerEnum(en.id, en.items);
        registery.registerCommand(cc, cb as unknown as (origin: CustomCommandOrigin, ...args: any[]) => CustomCommandResult | undefined);
    });
})