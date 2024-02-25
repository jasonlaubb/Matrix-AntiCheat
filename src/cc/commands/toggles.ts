import { Command } from "../handler";
import { lang } from "../../lib/language";
import { modules, utilities, checkState } from "../../modules/handler";

const command = new Command(data => data
    .setName("toggles")
    .setDescription(lang("-help.toggles"))
    .setUsage()
    .setAliases("toggleList"))
    .execute(({ sender: player }) => {
        const keys = Object.keys({ ...modules, ...utilities })
        const list = []
        for (const module of keys) {
            const state = checkState(module) ? "§aenabled" : "§cdisabled"
            list.push(`\n§l§7[${state}§7] §r§g${module}`)
        }
        player.tell(lang("-toggles.toggleList") + list.join(""))
    });

Command.subscribe(command);