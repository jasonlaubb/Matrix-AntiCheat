import { Command } from "../handler";
import { lang } from "../../lib/language";
//import { toggleList } from ** SOS **;

const command = new Command(data => data
    .setName("toggles")
    .setDescription(lang("-help.toggles"))
    .setUsage()
    .setAliases("toggleList"))
    .execute(({ sender: player }) => {
        // Unfinished
    });

Command.subscribe(command);