import { Command } from "../handler";
import { lang } from "../../lib/language";
import { world } from "@minecraft/server";

const command = new Command(data => data
  .setName("defaultrank")
  .setDescription(lang("-help.defaultrank"))
  .setUsage("rank"))
  .option("string", option => option.setName("rank"))
  .execute(({ sender: player }, [rank]) => {
    rank = rank as string
    world.setDynamicProperty("defaultRank", rank)
    player.tell(lang("-defaultrank.has", rank));
  });

Command.subscribe(command);