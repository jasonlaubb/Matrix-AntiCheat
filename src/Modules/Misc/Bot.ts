import { world, system, PlayerSpawnAfterEvent, Player, ChatSendAfterEvent } from "@minecraft/server";
import { FormCancelationReason, ModalFormData } from "@minecraft/server-ui";
import { flag, c, isAdmin, kick, rawstr } from "../../Assets/Util";

/**
 * @author RaMiGanerDev
 * @description anti Crashary (ARAS) bot or other bot from attacking the realm.
 * It works by making a verification for the player.
 */

function playerSpawn({ initialSpawn: spawn, player }: PlayerSpawnAfterEvent) {
    if (!spawn) return;
    if (isAdmin(player)) {
        player.verified = true;
        return;
    }
    player.notVerified = undefined;
    // wait 0.1 seconds
    system.run(() => {
        player.verifying = false;
        player.removeTag("matrix:verified");
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
            kick(player, "VERIFY_EXPIRED", "Matrix AntiCheat");
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
                    .show(player)
                    .then(({ formValues, canceled, cancelationReason }) => {
                        if (!player.notVerified) return;

                        // stop bot from bypassing the ui
                        if (canceled || !formValues[0] || codeNow != formValues[0]) {
                            player.verifying = undefined;
                            if (cancelationReason != FormCancelationReason.UserBusy) {
                                player.tryVerify += 1;

                                if (player.tryVerify > config.antiBot.maxTry) {
                                    kick(player, "VERIFY_FAILED", "Matrix AntiCheat");
                                    return;
                                }
                            }
                            return;
                        } else if (Date.now() - player.verifyClickSpeed <= config.antiBot.clickSpeedThershold * 50) {
                            flag(player, "Bot", "A", config.antiBot.maxVL, config.antiBot.punishment, ["Delay" + ":" + (now - player.verifyClickSpeed)]);
                            return;
                        }
                        player.sendMessage(new rawstr(true, "a").tra("bot.ok").parse());
                        player.notVerified = undefined;
                        player.verified = true;
                        player.addTag("matrix:verified");
                    });
            };
            if (!player.verifying) menu(player);
        } catch (error) {
            player.verifying = undefined;
            console.error(error);
        }
    }
}

function chatSend({ sender: player }: ChatSendAfterEvent) {
    const config = c();
    if (player.notVerified && player.verifying) {
        if (isAdmin(player)) return;
        flag(player, "Bot", "B", config.antiBot.maxVL, config.antiBot.punishment, undefined);
    }
}

let id: number;

export default {
    enable() {
        world.antiBotEnabled = true;
        const players = world.getAllPlayers();
        players.forEach((player) => (player.verified = true));
        id = system.runInterval(antiBot, 5);
        world.afterEvents.playerSpawn.subscribe(playerSpawn);
        world.afterEvents.chatSend.subscribe(chatSend);
    },
    disable() {
        world.antiBotEnabled = undefined;
        system.clearRun(id);
        world.afterEvents.playerSpawn.unsubscribe(playerSpawn);
        world.afterEvents.chatSend.unsubscribe(chatSend);
    },
};
