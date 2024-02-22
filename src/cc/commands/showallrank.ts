import { Command } from "../handler";
import { lang } from "../../lib/language";
import { world, system } from "@minecraft/server";

const command = new Command(data => data
  .setName("showallrank")
  .setDescription(lang("-help.showallrank"))
  .setUsage("true / false"))
  .option("boolean", option => option.setName("toggle"))
  .execute(({ sender: player }, [toggle]: any[]) => {
    world.setDynamicProperty("showAllRank", Boolean(toggle))
    system.run(() => player.sendMessage(`§bMatrix §7>§g ${lang("-showallrank.has").replace("%a", toggle)}`))
  });

Command.subscribe(command);