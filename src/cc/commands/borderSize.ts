import { Command } from "../handler";
import { lang } from "../../lib/language";
import { Vector3 } from "@minecraft/server";
import config from "../../data/config";
const lastSafePos = new Map<string, Vector3>()

const command = new Command(data => data
    .setName("borderSize")
    .setDescription(lang("-help.borderSize"))
    .setUsage("size"))
    .option("int", option => option.setName("size"))
    .execute(({ sender: player }, [size]) => {
        size = size as number
        if (size > 10000000 || size < 100) return player.warn(lang("-borderSize.between"));
        lastSafePos.clear();
        player.setDynamicProperty("worldBorderSize", size);
        player.tell(lang("-borderSize.ok", String(size) ?? String(config.modules.worldBorder.radius)));
    });

Command.subscribe(command);