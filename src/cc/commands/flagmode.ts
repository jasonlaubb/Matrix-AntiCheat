import { Command } from "../handler";
import { lang } from "../../lib/language";
import { world } from "@minecraft/server";

const command = new Command(data => data
  .setName("flagmode")
  .setDescription(lang("-help.flagmode"))
  .setUsage("oldPassword", "newPassword"))
  .option("string", option => option.setName("mode"))
  .execute(({ sender: player }, [mode]) => {
    if (!(new Set(["all", "tag", "bypass", "admin", "none"]).has(mode))) return player.sendMessage(`§bMatrix §7> §c ${lang("-flagmode.unknown")}`))
    world.setDynamicProperty("flagMode", mode)
    player.sendMessage(`§bMatrix §7>§g ${lang("-flagmode.changed").replace("%a", mode)}`);
  });

Command.subscribe(command);
