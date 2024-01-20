import { world, system, PlayerSpawnAfterEvent, Player, ChatSendAfterEvent } from "@minecraft/server";
import { FormCancelationReason, ModalFormData } from  "@minecraft/server-ui";
import { flag, c, isAdmin, kick } from "../../Assets/Util";
import lang from "../../Data/Languages/lang";

/**
 * @author RaMiGanerDev
 * @description anti Crashary (ARAS) bot or other bot from attacking the realm.
 * It works by making a verification for the player.
*/

const playerSpawn = ({ initialSpawn: spawn, player }: PlayerSpawnAfterEvent) => {
    if (!spawn) return
    if (isAdmin(player)) {
        player.verified = true
        return
    }
    player.notVerified = undefined
    // wait 0.1 seconds
    system.run(() => {
        player.verifying = false
        player.removeTag("matrix:verified")
        player.verifyTimer = Date.now()
        player.notVerified = true
        player.sendMessage(`§bMatrix §7> §c${lang(".Bot.waitUI")}`)
    })
};

const antiBot = () => {
    const players = world.getPlayers({ excludeTags: ["matrix:verified"] })
    const now = Date.now()
    const config = c()
    for (const player of players) {
            if (!player.notVerified) continue
            if (now - player.verifyTimer >= config.antiBot.timer * 1000 * 60) {
                kick (player, lang(".Bot.expired"), lang(".Bot.by"))
            }

            try {
                const menu = (player: Player) => {
                    player.verifyClickSpeed = Date.now()
                    if (!player.notVerified) return;
                    player.verifying = true
                    const codeNow = [0,0,0,0,0,0,0].map(() => Math.floor(Math.random() * 10)).join("")
                    player.tryVerify ??= 0
                    new ModalFormData()
                    .title(lang(".Bot.title"))
                    .textField(lang(".Bot.ui").replace("%a", String(player.tryVerify)).replace("%b", String(config.antiBot.maxTry)).replace("%c", String(Math.floor((config.antiBot.timer * 60000 - now + player.verifyTimer) / 1000))).replace("%d", codeNow), "0000000")
                    .show(player).then(({ formValues, canceled, cancelationReason }) => {
                    if (!player.notVerified) return;

                    // stop bot from bypassing the ui
                    if (canceled || !formValues[0] || codeNow != formValues[0]) {
                        player.verifying = undefined
                        if (cancelationReason != FormCancelationReason.UserBusy) {
                            player.tryVerify += 1

                            if (player.tryVerify > config.antiBot.maxTry) {
                                kick (player, lang(".Bot.failed"), lang(".Bot.by"))
                                return
                            }
                        }
                        return
                    } else if (Date.now() - player.verifyClickSpeed <= config.antiBot.clickSpeedThershold * 50) {
                        flag(player, "Bot", "A", config.antiBot.maxVL, config.antiBot.punishment, [lang(">Delay") + ":" + (now - player.verifyClickSpeed)]);
                        return
                    }
                    player.sendMessage(`§bMatrix §7> §a${lang(".Bot.ok")}`)
                    player.notVerified = undefined
                    player.verified = true
                    player.addTag("matrix:verified")
                    })
                }
                    if (!player.verifying) menu (player)
            } catch (error) {
                player.verifying = undefined
                console.error(error)
            }
    }
}

const chatSend = ({ sender: player }: ChatSendAfterEvent) => {
    const config = c()
    if (player.notVerified && player.verifying) {
        if (isAdmin(player)) return
        flag(player, "Bot", "B", config.antiBot.maxVL, config.antiBot.punishment, undefined);
    }
}

let id: number

export default {
    enable () {
        world.antiBotEnabled = true
        const players = world.getAllPlayers()
        players.forEach(player => player.verified = true)
        id = system.runInterval(antiBot, 5)
        world.afterEvents.playerSpawn.subscribe(playerSpawn)
        world.afterEvents.chatSend.subscribe(chatSend)
    },
    disable () {
        world.antiBotEnabled = undefined
        system.clearRun(id)
        world.afterEvents.playerSpawn.unsubscribe(playerSpawn)
        world.afterEvents.chatSend.unsubscribe(chatSend)
    }
}
