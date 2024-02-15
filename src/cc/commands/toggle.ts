import { Command } from "../handler";
import { lang } from "../../lib/language";
import { modules, checkState } from "../../modules/handler";import { world } from "@minecraft/server";

const command = new Command(data => data
    .setName("toggle")
    .setDescription(lang("-help.toggle"))
    .setAliases("switch","turn")
    .setUsage("module", "true / false"))
    .option("string", option => option.setName("module"))
    .option("boolean", option => option.setName("state"))
    .execute(({ sender: player }, [module, state]) => {
        if (!Object.keys(modules).includes(module)) {
            player.warn(lang("-toggles.unknownModule"))
            return
        }
        if (checkState(module) == state) {
            player.warn(lang("-toggles.already"))
        }
        world.setDynamicProperty(module, state)
        player.tell(lang("-toggles.already", state ? "enabled" : "disabled"))
    })

Command.subscribe(command)