import { world, system, PlayerSpawnAfterEvent } from "@minecraft/server";
import { ActionFormData } from  "@minecraft/server-ui";
import { flag, c, isAdmin, kick } from "../../Assets/Util";
import lang from "../../Data/Languages/lang";

/**
 * @author RaMiGanerDev
 * @description anti Crashary (ARAS) bot attack realms with bot press button detector
*/

// Need change 100%

const config = c();

const playerSpawn = ({ intialSpawn: spawn, player }: PlayerSpawnAfterEvent) => {
    if (isAdmin(player)) return
    player.removeTag("matrix:verified")
    // wait 0.1 seconds
    system.runTimeout(() => {
        if (spawn) {
            player.verifyTimer ??= Date.now()
            player.notVerified = true
            player.sendMessage(`§bMatrix §7> §cyou cant chat untill you §averify §cclose chat and wait ui to show you have §e${config.antiARAS.timer} §cminute to §averify`);
        }
    }, 2)
};

const antiBot = () => {
    const players = world.getAllPlayers()
    const now = Date.now()
    for (const player of players) {
            if (!player.notVerified) continue
            if (now - player.verifyTimer >= config.antiARAS.timer * 1000 * 60) {
                kick (player, "Matrix AntiCheat", "non bot verify failed")
            }
            
            player.verifyClickSpeed = Date.now()

            try {
                const ui = new ModalFormData()
                .title("Anti Bot")
                
                const menu = (player) => {
                    if (!player.notVerified) return;
                    player.verifying = true
                    const codeNow = [0,0,0,0,0,0].map(() => Math.floor(Math.random() * 10)).join("")
                    ui.textField("You need to verify if you're not a bot\nYou have " + Math.floor((now - player.verifyTimer) / 1000) + " seconds left\nEnter the code " + codeNow + " below", "000000", undefined);
                    ui.show(player).then(({ formValues, canceled }) => {
                    if (!player.notVerified) return;

                    // stop attack bot
                    if (result.cancled || !formValues[0] || codeNow != formValues[0]) {
                        player.verifying = false
                        system.run(() => menu(player))
                        continue
                    } else if (now - player.verifyClickSpeed <= config.antiARAS.clickSpeedThershold * 50 && result.selection == 0) {
                        flag(player, "Crashary Bot", "A", config.antiARAS.maxVL, config.antiARAS.punishment, [lang(">Delay") + ":" + (Date.now() - clickSpeed.get(player.id)).toFixed(2)]);
                        continue
                    }
                    player.sendMessage(`§bMatrix §7> §aYou have been verified successfully`)
                    player.notVerified = undefined
                    player.addTag("matrix:verified")
                    }
                                         if (!player.verifying) menu (player)
                    }
            } catch {
                player.verifying = undefined
            }
    }
}

let id: number

export default {
    enable () {
        world.antiBotEnabled = true
        id = system.runInterval(antiBot, 60)
        world.afterEvents.playerSpawn.subscribe(playerSpawn)
    },
    disable () {
        world.antiBotEnabled = undefined
        system.clearRun(id)
        world.afterEvents.playerSpawn.unsubscribe(playerSpawn)
    }
}
