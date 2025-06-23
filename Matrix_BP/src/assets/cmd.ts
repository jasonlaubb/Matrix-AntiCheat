import { CustomCommand, CustomCommandOrigin, CustomCommandResult, Player, system } from "@minecraft/server";
export interface cmd {
    cc: CustomCommand;
    cb: (player: Player, ...args: any[]) => CustomCommandResult | undefined;
    en?: {
        id: string;
        items: string[];
    }
}
import about from "../program/command/about";
import set from "../program/command/set";
import setting from "../program/command/setting";
import echestwipe from "../program/command/echestwipe";
import invsee from "../program/command/invsee";
import listmodule from "../program/command/listmodule";
import log from "../program/command/log";
import modCommand from "../program/command/modCommand";
system.beforeEvents.startup.subscribe((event) => {
    const commands: cmd[] = [
        about,
        ...set,
        setting,
        echestwipe,
        invsee,
        listmodule,
        ...log,
        ...modCommand,
    ];
    const registery = event.customCommandRegistry;
    commands.forEach(({ cc, cb, en }) => {
        if (en) registery.registerEnum(en.id, en.items);
        registery.registerCommand(cc, cb as unknown as (origin: CustomCommandOrigin, ...args: any[]) => CustomCommandResult | undefined);
    });
})