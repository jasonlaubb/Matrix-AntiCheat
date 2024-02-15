import { Command } from "../handler";
import { lang } from "../../lib/language";
import version from "../../version"
const command = new Command(data => data
    .setName("about")
    .description(lang("-help.about"))
    .usage()
    .requires(() => true))
    .execute(({ sender: player }) => {
        player.sendMessage(`§bMatrix §7>§g ${lang("-about.line1")}\n§g${lang("-about.version")}: §cV${version.join('.')}\n§g${lang("-about.author")}: §cjasonlaubb\n§gGitHub: §chttps://github.com/jasonlaubb/Matrix-AntiCheat`)
    })

Command.subscribe(command)