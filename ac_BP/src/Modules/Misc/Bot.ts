import { world, system, PlayerSpawnAfterEvent, Player, ChatSendAfterEvent } from "@minecraft/server";
import { FormCancelationReason, ModalFormData } from "@minecraft/server-ui";
import { c, isAdmin, rawstr } from "../../Assets/Util";
import { Action } from "../../Assets/Action";
import { MatrixEvents, MatrixUsedTags } from "../../Data/EnumData";
import { configi, registerModule } from "../Modules";

/**
 * @author RaMiGanerDev
 * @description anti Crashary (ARAS) bot or other bot from attacking the realm.
 * It works by making a verification for the player.
 */

async function playerSpawn(_config: configi, { initialSpawn: spawn, player }: PlayerSpawnAfterEvent) {
    if (!spawn) return;
    if (isAdmin(player)) {
        player.verified = true;
        return;
    }
    // wait 0.1 seconds
    system.run(() => {
        player.verifying = false;
        player.removeTag(MatrixUsedTags.verified);
        player.verifyTimer = Date.now();
        player.notVerified = true;
        player.sendMessage(new rawstr(true, "c").tra("bot.waitui").parse());
    });
}

function antiBot() {
    const players = world.getPlayers({ excludeTags: ["matrix:verified"] });
    const now = Date.now();
    const config = c();
    for (const player of players) {
        if (!player.notVerified) continue;
        if (now - player.verifyTimer >= config.antiBot.timer * 1000 * 60) {
            Action.kick(player, "VERIFY_EXPIRED", "Matrix AntiCheat");
        }

        try {
            const menu = (player: Player) => {
                player.verifyClickSpeed = Date.now();
                if (!player.notVerified) return;
                player.verifying = true;
                const codeNow = [0, 0, 0, 0, 0, 0, 0].map(() => Math.floor(Math.random() * 10)).join("");
                player.tryVerify ??= 0;
                new ModalFormData()
                    .title(rawstr.drt("bot.title"))
                    .textField(
                        new rawstr()
                            .tra("bot.ui.headline")
                            .str("\n")
                            .tra("bot.ui.need", String(player.tryVerify), String(config.antiBot.maxTry))
                            .str("\n")
                            .tra("bot.ui.haveleft", String(Math.floor((config.antiBot.timer * 60000 - now + player.verifyTimer) / 1000)))
                            .str("\n")
                            .tra("bot.ui.enterbelow", codeNow)
                            .parse(),
                        "0000000"
                    )
                    //@ts-expect-error
                    .show(player)
                    .then(({ formValues, canceled, cancelationReason }) => {
                        if (!player.notVerified) return;

                        // stop bot from bypassing the ui
                        if (canceled || !formValues![0] || codeNow != formValues![0]) {
                            player.verifying = undefined!;
                            if (cancelationReason != FormCancelationReason.UserBusy) {
                                player.tryVerify += 1;

                                if (player.tryVerify > config.antiBot.maxTry) {
                                    Action.kick(player, "VERIFY_FAILED", "Matrix AntiCheat");
                                    return;
                                }
                            }
                            return;
                        } else if (Date.now() - player.verifyClickSpeed <= config.antiBot.clickSpeedThershold * 50) {
                            player.triggerEvent(MatrixEvents.tempkick);
                            return;
                        }
                        player.sendMessage(new rawstr(true, "a").tra("bot.ok").parse());
                        player.notVerified = undefined!;
                        player.verified = true;
                        player.addTag(MatrixUsedTags.verified);
                    });
            };
            if (!player.verifying) menu(player);
        } catch (error) {
            player.verifying = undefined!;
            console.error(error);
        }
    }
}

async function chatSend(_config: configi, { sender: player }: ChatSendAfterEvent) {
    if (player.notVerified && player.verifying) {
        if (isAdmin(player)) return;
        player.triggerEvent(MatrixEvents.tempkick);
    }
}

registerModule(
    "antiBot",
    false,
    [],
    {
        worldSignal: world.afterEvents.playerSpawn,
        then: playerSpawn,
    },
    {
        worldSignal: world.afterEvents.chatSend,
        then: chatSend,
    },
    {
        tickInterval: 20,
        onTick: async (_config: configi) => antiBot(),
    }
);
