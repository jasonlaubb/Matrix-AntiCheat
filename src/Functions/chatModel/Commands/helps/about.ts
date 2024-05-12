import { registerCommand, sendRawText } from "../../CommandHandler";
import version from "../../../../version";

registerCommand ({
    name: "about",
    description: "About Matrix AntiCheat",
    parent: false,
    maxArgs: 0,
    require: (_player) => true,
    executor: async (player, _args) => {
        // Send the About message
        sendRawText(player,
            { text: "§bMatrix §7>§c " },
            { translate: "about.line1" },
            { text: "\n"},
            { translate: "about.version" },
            { text: `§cV${version.join(".")}\n§g` },
            { translate: "about.author" },
            { text: `§cjasonlaubb\n§g` },
            { translate: "about.github" },
            { text: `§chttps://github.com/jasonlaubb/Matrix-AntiCheat` }
        );
    }
});