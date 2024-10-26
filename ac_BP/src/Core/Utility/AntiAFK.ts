import { Player, system, Vector3, world } from "@minecraft/server";
import { configi, registerModule } from "../Modules";
import { AnimationControllerTags } from "../../Data/EnumData";
import { ActionFormData } from "@minecraft/server-ui";
import { rawstr } from "../../Assets/Util";
import { Action } from "../../Assets/Action";
interface AfkData {
    lastMove: number;
    lastLocation: Vector3;
    isPlayerChecking: boolean;
    isWarned: boolean;
    isTipped: boolean;
}
const afkData = new Map<string, AfkData>();
async function checkAFK(config: configi, player: Player) {
    const data =
        afkData.get(player.id) ??
        ({
            lastMove: Date.now(),
            lastLocation: player.location,
            isPlayerChecking: false,
            isWarned: false,
            isTipped: false,
        } as AfkData);
    if (data.isPlayerChecking) return;
    const isPlayerMoving = player.hasTag(AnimationControllerTags.moving) && (player.location.x != data.lastLocation.x || player.location.z != data.lastLocation.z);
    const timeSinceLastMove = Date.now() - data.lastMove;
    if (isPlayerMoving) {
        data.lastMove = Date.now();
        if (timeSinceLastMove > config.antiAFK.tipsTime) {
            player.sendMessage(rawstr.drt("afk.quit"));
        }
    } else {
        if (timeSinceLastMove > config.antiAFK.maxAFKTime) {
            data.isPlayerChecking = true;
            const ui = new ActionFormData()
                .title(rawstr.drt("afk.ui.title"))
                .body(new rawstr().tra("afk.intro").str("\n").tra("afk.why").str("\n").tra("afk.clickbelow").parse())
                .button(rawstr.drt("afk.ui.button"))
                //@ts-expect-error
                .show(player);
            afkData.set(player.id, data);
            const disconnectState = await new Promise<boolean>((resolve) => {
                const interval = system.runInterval(() => {
                    if (Date.now() - data.lastMove > config.antiAFK.maxUIallowance) {
                        system.clearRun(interval);
                        resolve(true);
                    }
                }, 20);
                ui.then((result) => {
                    system.clearRun(interval);
                    if (result.canceled) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            });
            if (disconnectState) {
                Action.tempkick(player);
                world.sendMessage(rawstr.drt("afk.kick", player.name));
            } else {
                afkData.delete(player.id);
            }
            return;
        } else if (timeSinceLastMove > config.antiAFK.warnTime) {
            player.sendMessage(rawstr.drt("afk.warn", ((config.antiAFK.maxAFKTime - timeSinceLastMove) * 0.05).toString()));
            data.isWarned = true;
        } else if (timeSinceLastMove > config.antiAFK.tipsTime) {
            player.sendMessage(rawstr.drt("afk.tips"));
            data.isTipped = true;
        }
    }
    data.lastLocation = player.location;
}

registerModule("antiAFK", false, [], {
    tickInterval: 5,
    intick: checkAFK,
});
