import { world, system } from "@minecraft/server";
import { ActionFormData } from  "@minecraft/server-ui";
import { flag, c, isAdmin } from "../../Assets/Util";
import lang from "../../Data/Languages/lang";

/**
 * @author RaMiGanerDev
 * @description anti Crashary (ARAS) bot attack realms with bot press button detector
*/

// Need change 100%

const config = c();

world.afterEvents.playerSpawn.subscribe((event) => {
    const spawn = event.intialSpawn;
    const player = event.player;
    
    if (spawn && !player.hasTag("matrix:dead")) {
        player.verifyTimer ??= Date.now()
        player.addTag("matrix:notVerified");
        player.sendMessage(`§bMatrix §7> §cyou cant chat untill you §averify §cclose chat and wait ui to show you have §e${config.antiARAS.timer} §cminute to §averify`);
    }
});

system.runInterval(() => {
    for (let player of world.getPlayers()) {
        if (player.hasTag("matrix:notVerified")) {
            if (Date.now() - player.verifyTimer >= config.antiARAS.timer * 1000 * 60 && player.hasTag("matrix:notVerified")) {
                flag(player, "Verify", "A", 0, "kick", undefined);
            }
            
            player.verifyClickSpeed = Date.now()
            
            new ActionFormData()
            .title("Captcha")
            .body("You need to verify that you're not a bot by clicking Verify")
            .button("§a§l§¶Verify")   
            .show(player).then((result) => {
                if (result.cancled) {
                    if (!player.hasTag("matrix:notVerified")) return;
                    player.runCommand(`kick "${player.name}" §r\n§c§l$You have been kicked§r\n§7Reason: §eYou have to verify\n§7By: §eMatrix`);
                } else if (result.selection == 0 && Date.now() - player.verifyClickSpeed > config.antiARAS.clickSpeedThershold * 50) {
                    if (!player.hasTag("matrix:notVerified")) return;
                    player.removeTag("matrix:notVerified");
                    player.sendMessage(`§bMatrix §7> §aYou have been verified successfully`);
                } else if (Date.now() - clickSpeed.get(player.id) <= config.antiARAS.clickSpeedThershold * 50 && result.selection == 0) {
                    flag(player, "ARAS (Crashary)", "A", config.antiARAS.maxVL, config.antiARAS.punishment, [lang(">Delay") + ":" + (Date.now() - clickSpeed.get(player.id)).toFixed(2)]);
                }
            });
        }
    }
}, 60);

world.afterEvents.playerLeave.subscribe((playerId) => {
    const id = playerId;
    timer.delete(id);
    clickSpeed.delete(id);
});
