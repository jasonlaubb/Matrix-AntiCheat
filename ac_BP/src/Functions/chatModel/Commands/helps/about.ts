import { registerCommand, sendRawText } from "../../CommandHandler";
import version from "../../../../version";

registerCommand({
    name: "about",
    description: "About Matrix AntiCheat",
    parent: false,
    maxArgs: 0,
    require: (_player) => true,
    executor: async (player, _args) => {
        // Send the About message
        sendRawText(
            player,
            { text: "§bMatrix §7>§g " },
            { translate: "about.line", with: [] },
            { text: "\n" },
            { translate: "about.version", with: [] },
            { text: `§g: §cV${version.join(".")}\n§g` },
            { translate: "about.author", with: [] },
            { text: `§g: §cjasonlaubb\n§g` },
            { translate: "about.github", with: [] },
            { text: `§g: §chttps://github.com/jasonlaubb/Matrix-AntiCheat` }
        );
    },
});
