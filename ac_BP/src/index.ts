/**
 * @author jasonlaubb
 * @contributors ravriv, Hutao999999, RaMiGamerDev, notthinghere
 * @translate amico_nabbo, kris02, Selder578
 * @license AGPLv3
 * @link https://github.com/jasonlaubb/Matrix-AntiCheat
 */
//Log the run time
const runTime = Date.now();
import { world, system } from "@minecraft/server";
world.modules = [];
system.beforeEvents.watchdogTerminate.subscribe((event) => {
    // Cancel watchdogTerminate event
    event.cancel = true;
    system.run(() => {
        console.log(`Index :: ${new Date(Date.now()).toISOString()} | WatchdogTerminate cancelled, reason: ${event.terminateReason}`);
    });
});
import "./Assets/LatinNormalize";
//Initialize the config
import { initialize } from "./Functions/Config/dynamic_config";
initialize();
//Load the language
import "./Assets/Language";
//load the public subscibe util
import "./Assets/Public";
//load the functions
import "./Functions/chatModel/ChatHandler";
import "./Functions/moderateModel/banHandler";
import "./Functions/moderateModel/freezeHandler";
import "./Functions/moderateModel/eventHandler";
import "./Functions/moderateModel/dimensionLock";
import "./Functions/moderateModel/lockDown";
import "./Functions/moderateModel/log";
import "./Functions/chatModel/Commands/import";
import { c } from "./Assets/Util";
//start all modules
import "./Modules/Modules";
import { intilizeModules } from "./Modules/Modules";
world.afterEvents.worldInitialize.subscribe(async () => {
    // Cpu explode warning!
    intilizeModules().then((amount) => {
        world.sendMessage(`§bMatrix §7>§g Intilized ${amount} module(s) in ${Date.now() - runTime}ms.`);
    });
});

if (c().createScoreboard) {
    world.afterEvents.worldInitialize.subscribe(() => {
        try {
            world.scoreboard.addObjective("matrix:api", "").setScore("matrix:beta-api-enabled", -2048);
        } catch {}
    });
}
