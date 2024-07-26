import { c } from "../../../../Assets/Util";
import { registerCommand, verifier } from "../../CommandHandler";
import { rawstr } from "../../../../Assets/Util";
import { MatrixUsedTags } from "../../../../Data/EnumData";

registerCommand({
    name: "packetlogger",
    description: "Get or remove the packetlogger permission",
    parent: false,
    maxArgs: 0,
    minArgs: 0,
    require: (player) => verifier(player, c().commands.packetlogger),
    executor: async (player, _args) => {
        if (player.hasTag(MatrixUsedTags.packetlogger)) {
            player.removeTag(MatrixUsedTags.packetlogger);
            player.sendMessage(new rawstr(true, "g").tra("packetlogger.remove").parse());
        } else {
            player.addTag(MatrixUsedTags.packetlogger);
            player.sendMessage(new rawstr(true, "g").tra("packetlogger.add").parse());
        }
    },
});
