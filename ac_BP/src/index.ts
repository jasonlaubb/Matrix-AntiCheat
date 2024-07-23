/**
 * @author jasonlaubb
 * @contributors ravriv, Hutao999999, RaMiGamerDev, notthinghere
 * @translate amico_nabbo, kris02, Selder578
 * @license AGPLv3
 * @link https://github.com/jasonlaubb/Matrix-AntiCheat
 */
const runTime = Date.now();
import * as Minecraft from "@minecraft/server";
import { initialize } from "./Functions/Config/dynamic_config";
import { intilizeModules } from "./Modules/Modules";
import Dynamic from "./Functions/Config/dynamic_config";
Minecraft.system.beforeEvents.watchdogTerminate.subscribe((event) => {
    event.cancel = true;
});
Minecraft.world.afterEvents.worldInitialize.subscribe(() => {
    initialize();
    Minecraft.world.modules = [];
    intilizeModules().then((amount) => {
        Minecraft.world.sendMessage(`§bMatrix §7>§g Intilized ${amount} module(s) in ${Date.now() - runTime}ms.`);
    });
    if (Dynamic.config().createScoreboard && !world.scoreboard.getObjective("matrix:api")) {
        Minecraft.world.scoreboard.addObjective("matrix:api", "").setScore("matrix:beta-api-enabled", -2048);
    }
});
import "./Assets/LatinNormalize";
import "./Assets/Language";
import "./Assets/Public";
import "./Functions/chatModel/ChatHandler";
import "./Functions/moderateModel/banHandler";
import "./Functions/moderateModel/freezeHandler";
import "./Functions/moderateModel/eventHandler";
import "./Functions/moderateModel/dimensionLock";
import "./Functions/moderateModel/lockDown";
import "./Functions/moderateModel/log";
import "./Functions/chatModel/Commands/import";
import "./Modules/Modules";