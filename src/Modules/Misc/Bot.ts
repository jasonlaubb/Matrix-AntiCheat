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
    if (isAdmin(player)) {
        player.verified = true
        return
    }
    player.removeTag("matrix:verified")
    // wait 0.1 seconds
    system.runTimeout(() => {
        if (spawn) {
            player.verifyTimer = Date.now()
            player.notVerified = true
            player.sendMessage(`§bMatrix §7> §cFor security reason, you cannot chat untill you finished verify process. Please wait until the verify ui be shown`);
        }
    }, 2)
};

const antiBot = () => {
    const players = world.getPlayers({ excludeTags: ["matrix:verified"] })
    const now = Date.now()
    const config = c()
    for (const player of players) {
            if (!player.notVerified) continue
            if (now - player.verifyTimer >= config.antiBot.timer * 1000 * 60) {
                kick (player, "Expired verification", "(Bot defensive action)")
            }

            try {
                const menu = (player: Player) => {
                    player.verifyClickSpeed = Date.now()
                    if (!player.notVerified) return;
                    player.verifying = true
                    const codeNow = [0,0,0,0,0,0,0].map(() => Math.floor(Math.random() * 10)).join("")
                    player.tryVerify ??= 0
                    new ModalFormData()
                    .title("Anti Bot Verification")
                    .textField("§a[This server is protected by Matrix AntiCheat]\n§gYou need to verify if you're not a bot §7("+player.tryVerify+"/"+config.antiBot.maxTry+")§g\nYou have §e" + Math.floor((config.antiBot.timer * 60000 - now + player.verifyTimer) / 1000) + " §gseconds left\nEnter the code §e§l" + codeNow + "§r§g below", "000000", undefined)
                    .show(player).then(({ formValues, canceled, cancelationReason }) => {
                    if (!player.notVerified) return;

                    // stop bot from bypassing the ui
                    if (canceled || !formValues[0] || codeNow != formValues[0]) {
                        player.verifying = undefined
                        if (cancelationReason != FormCancelationReason.UserBusy) {
                            player.tryVerify += 1

                            if (player.tryVerify > config.antiBot.maxTry) {
                                kick (player, "Anti bot verify failed", "(Bot defensive action)")
                                return
                            }
                        }
                        return
                    } else if (Date.now() - player.verifyClickSpeed <= config.antiBot.clickSpeedThershold * 50) {
                        flag(player, "Bot", "A", config.antiBot.maxVL, config.antiBot.punishment, [lang(">Delay") + ":" + (now - player.verifyClickSpeed)]);
                        return
                    }
                    player.sendMessage(`§bMatrix §7> §aYou have been verified successfully`)
                    player.notVerified = undefined
                    player.verified = true
                    player.addTag("matrix:verified")
                    })
                }
                    if (!player.verifying) menu (player)
            } catch {
                player.verifying = undefined
            }
    }
}

const chatSend = ({ sender: player }: ChatSendAfterEvent) => {
    const config = c()
    if (player.notVerified && player.verifying) {
        if (isAdmin(player)) return
        flag(player, "Bot Attack", "B", config.antiBot.maxVL, config.antiBot.punishment, undefined);
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
