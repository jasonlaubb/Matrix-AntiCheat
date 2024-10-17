import { PlayerSpawnAfterEvent, system, world } from "@minecraft/server";
import { configi, registerModule } from "../Modules";
import { MatrixUsedTags } from "../../Data/EnumData";
import { rawstr } from "../../Assets/Util";

async function onPlayJoin(config: configi, event: PlayerSpawnAfterEvent) {
    if (!event.initialSpawn) return;
    if (!event.player.hasTag(config.welcomer.joinedbeforetag as MatrixUsedTags)) {
        event.player.addTag(config.welcomer.joinedbeforetag as MatrixUsedTags);
        world.sendMessage(rawstr.drt("welcomer.new", event.player.name));
    }
    system.runTimeout(() => {
        event.player.sendMessage(new rawstr().tra("welcomer.protectedline").str("\n").tra("welcomer.wantdownload", config.commands.prefix).parse());
    }, config.welcomer.delay);
}

registerModule("welcomer", true, [], {
    worldSignal: world.afterEvents.playerSpawn,
    then: onPlayJoin,
});
