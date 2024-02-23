import { Command } from "../handler";
import { lang } from "../../lib/language";
import version from "../../version"
const command = new Command(data => data
    .setName("about")
    .setDescription(lang("-help.about"))
    .setUsage()
    .setRequires(() => true))
    .execute(({ sender: player }) => {
        player.tell(`${lang("-about.line1")}\n§g${lang("-about.version")}: §cV${version.join('.')}\n§g${lang("-about.author")}: §cjasonlaubb\n§gGitHub: §chttps://github.com/jasonlaubb/Matrix-AntiCheat`)
    })

Command.subscribe(command)