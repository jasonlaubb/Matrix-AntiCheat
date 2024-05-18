/**
 * @author jasonlaubb
 * @contributors ravriv, Hutao999999, RaMiGamerDev, notthinghere
 * @translate amico_nabbo, kris02, Selder578
 * @license AGPLv3
 * @link https://github.com/jasonlaubb/Matrix-AntiCheat
 */
import { world, system } from "@minecraft/server";
system.beforeEvents.watchdogTerminate.subscribe((event) => {
    // Cancel watchdogTerminate event
    event.cancel = true;
    system.run(() => {
        console.log(`Index :: ${new Date(Date.now()).toISOString()} | WatchdogTerminate cancelled, reason: ${event.terminateReason}`);
    });
});
//Log the run time
const runTime = Date.now();
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
import { onStart } from "./Functions/chatModel/CommandHandler";
onStart();
//start all modules
import { moduleStart } from "./Modules/Modules";
moduleStart();
if (c().createScoreboard)
    world.afterEvents.worldInitialize.subscribe(() => {
        world.scoreboard.addObjective("matrix:api", "").setScore("matrix:beta-api-enabled", -2048);
    });
system.run(() => {
    console.log("Index :: Successfully load the program (" + (Date.now() - runTime - 50) + "ms)");
});
