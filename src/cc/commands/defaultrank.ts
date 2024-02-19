import { Command } from "../handler";
import { lang } from "../../lib/language";
import { world } from "@minecraft/server";

const command = new Command(data => data
  .setName("defaultrank")
  .setDescription(lang("-help.defaultrank"))
  .setUsage("rank"))
  .option("string", option => option.setName("rank"))
  .execute(({ sender: player }, [rank]) => {
    world.setDynamicProperty("defaultRank", rank)
    player.sendMessage(`§bMatrix §7>§g ${lang("-defaultrank.has").replace("%a", rank)}`);
  });

Command.subscribe(command);
