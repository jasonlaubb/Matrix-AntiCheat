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
    player.removeTag("matrix:allowedChat")
    // wait 0.1 seconds
    system.runTimeout(() => {
        if (spawn) {
            player.verifyTimer ??= Date.now()
            player.addTag("matrix:notVerified");
            player.sendMessage(`§bMatrix §7> §cyou cant chat untill you §averify §cclose chat and wait ui to show you have §e${config.antiARAS.timer} §cminute to §averify`);
        }
    }, 2)
};

const antiBot = () => {
    const players = world.getPlayers({ tags: ["matrix:notVerified"] })
    const now = Date.now()
    for (const player of players) {
            if (now - player.verifyTimer >= config.antiARAS.timer * 1000 * 60 && player.hasTag("matrix:notVerified")) {
                kick (player, "Matrix AntiCheat", "non bot verify failed")
            }
            
            player.verifyClickSpeed = Date.now()

            try {
                const ui = new ActionFormData()
                .title("Anti Bot")
                .body("You need to verify that you're not a bot by clicking Verify")
                .button("§a§l§¶Verify");
                
                const menu = (player) => ui.show(player).then((result) => {
                    if (result.cancled) {
                        system.run(() => menu(player))
                    } else if (result.selection == 0 && Date.now() - player.verifyClickSpeed > config.antiARAS.clickSpeedThershold * 50) {
                        if (!player.hasTag("matrix:notVerified")) return;
                        player.removeTag("matrix:notVerified");
                        player.sendMessage(`§bMatrix §7> §aYou have been verified successfully`);
                    } else if (now - player.verifyClickSpeed <= config.antiARAS.clickSpeedThershold * 50 && result.selection == 0) {
                        flag(player, "Crashary Bot", "A", config.antiARAS.maxVL, config.antiARAS.punishment, [lang(">Delay") + ":" + (Date.now() - clickSpeed.get(player.id)).toFixed(2)]);
                    }
                });

                menu (player)
            } catch { }
    }
}

let id: number

export default {
    enable () {
        id = system.runInterval(antiBot, 60)
        world.afterEvents.playerSpawn.subscribe(playerSpawn)
    },
    disable () {
        system.clearRun(id)
        world.afterEvents.playerSpawn.unsubscribe(playerSpawn)
    }
}
