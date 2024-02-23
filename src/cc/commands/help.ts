import { Command } from "../handler";
import { lang } from "../../lib/language";
import matrix from "../../lib/matrix";
import config from "../../data/config";
const command = new Command(data => data
    .setName("help")
    .setDescription(lang("-help.about"))
    .setUsage()
    .setAliases("h")
    .setRequires((player) => matrix.isAdmin(player)))
    .execute(({ sender: player }) => {
        const commands = Command.getCommands()
        let output = lang("-help.helpCDlist")
        for (const { data } of commands) {
            output += "\n" + config.commandOptions.prefix + data.name
            if (data.usage.length > 0) {
                output += " " + data.usage.map(dat => `<${dat}>`).join(" ")
            }
            output += " - " + data.description 
        }
        player.tell(output)
    })

Command.subscribe(command)