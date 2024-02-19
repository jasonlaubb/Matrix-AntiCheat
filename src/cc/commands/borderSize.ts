import { Command } from "../handler";
import { lang } from "../../lib/language";
import { world } from "@minecraft/server";
//import { config } from ** help json :< **;
//import { lastSafePos } from ** help json :< **;

const command = new Command(data => data
  .setName("borderSize")
  .setDescription(lang("-help.borderSize"))
  .setUsage("size")
  .option("int", option => option.setName("size"))
  .execute(({ sender: player }, [size]) => {
    if (size > 10000000 || size < 100) return system.run(() => player.sendMessage(`§bMatrix §7>§c ${lang("-borderSize.between")}`));
    system.run(() => {
      lastSafePos.clear();
      player.setDynamicProperty("worldBorderSize", size);
      player.sendMessage("§bMatrix §7>§g " + lang("-borderSize.ok").replace("%a", String(size ?? config.worldBorder.radius)));
    });
  });

Command.subscribe(command);