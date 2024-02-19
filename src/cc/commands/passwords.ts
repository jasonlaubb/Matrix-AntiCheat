import { Command } from "../handler";
import { lang } from "../../lib/language";
//import { SHA256 } from ** SOS **;
import { world } from "@minecraft/server";

const command = new Command(data => data
  .setName("passwords")
  .setDescription(lang("-help.passwords"))
  .setUsage("oldPassword", "newPassword")
  .setAliases("setPassword", "pw"))
  .option("string", option => option.setName("oldPassword"))
  .option("string", option => option.setName("newPassword"))
  .execute(({ sender: player }, [oldPassword, newPassword]) => {
    const correctPassword = (world.getDynamicProperty("password") ?? config.commands.password);
    if (oldPassword !== correctPassword) return player.sendMessage(`§bMatrix §7>§g ${lang("-passwords.wrong")}`);
    world.sendMessage(`§bMatrix §7>§g ${player.name} ${lang("-passwords.changed")}`);
    world.setDynamicProperty("sha_password", String(SHA256(newPassword)))
  });

Command.subscribe(command);