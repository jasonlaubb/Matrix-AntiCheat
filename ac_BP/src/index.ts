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
const init = { initialized: false };
Minecraft.world.afterEvents.worldInitialize.subscribe(() => {
    init.initialized = true;
    initialize();
    const config = Dynamic.config();
    if (config.createScoreboard && !Minecraft.world.scoreboard.getObjective("matrix:api")) {
        Minecraft.world.scoreboard.addObjective("matrix:api", "").setScore("matrix:beta-api-enabled", -2048);
    }
    Minecraft.system.run(() => intilizeModules().then((amount) => {
        if (config.sendInitMsg) Minecraft.world.sendMessage({ rawtext: [
            {
                text: `§bMatrix §7>§g `
            },
            {
                translate: "index.initmodules",
                with: [amount.toString(), (Date.now() - runTime).toString()]
            }
        ]});
    }));
});
export default class Index {
    private constructor () {}
    static get initialized(): boolean {
        return init.initialized;
    }
    static readonly initializeAsync = () => new Promise<void>((resolve) => {
        const runId = Minecraft.system.runInterval(() => {
            if (init.initialized) {
                resolve();
                Minecraft.system.clearRun(runId);
            }
        }, 1);
    });
    static get initializeDate (): number {
        return runTime;
    }
}
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
// Register the commands
import "./Functions/chatModel/Commands/helps/about";
import "./Functions/chatModel/Commands/helps/help";
import "./Functions/chatModel/Commands/moderations/op";
import "./Functions/chatModel/Commands/moderations/deop";
import "./Functions/chatModel/Commands/moderations/rank";
import "./Functions/chatModel/Commands/moderations/rankclear";
import "./Functions/chatModel/Commands/moderations/ban";
import "./Functions/chatModel/Commands/moderations/banqueue";
import "./Functions/chatModel/Commands/moderations/bypasslist";
import "./Functions/chatModel/Commands/moderations/unban";
import "./Functions/chatModel/Commands/moderations/tempkick";
import "./Functions/chatModel/Commands/moderations/mute";
import "./Functions/chatModel/Commands/moderations/unmute";
import "./Functions/chatModel/Commands/moderations/echestwipe";
import "./Functions/chatModel/Commands/moderations/freeze";
import "./Functions/chatModel/Commands/moderations/unfreeze";
import "./Functions/chatModel/Commands/moderations/invsee";
import "./Functions/chatModel/Commands/moderations/invcopy";
import "./Functions/chatModel/Commands/moderations/vanish";
import "./Functions/chatModel/Commands/moderations/unvanish";
import "./Functions/chatModel/Commands/settings/toggles";
import "./Functions/chatModel/Commands/settings/toggle";
import "./Functions/chatModel/Commands/settings/passwords";
import "./Functions/chatModel/Commands/settings/flagmode";
import "./Functions/chatModel/Commands/settings/defaultrank";
import "./Functions/chatModel/Commands/settings/showallrank";
import "./Functions/chatModel/Commands/settings/reset";
import "./Functions/chatModel/Commands/settings/banrun";
import "./Functions/chatModel/Commands/settings/lockdown";
import "./Functions/chatModel/Commands/settings/lockdowncode";
import "./Functions/chatModel/Commands/settings/unlock";
import "./Functions/chatModel/Commands/settings/antispam";
import "./Functions/chatModel/Commands/settings/config";
import "./Functions/chatModel/Commands/settings/setutil";
import "./Functions/chatModel/Commands/utilities/adminchat";
import "./Functions/chatModel/Commands/utilities/itemui";
import "./Functions/chatModel/Commands/utilities/matrixui";
import "./Functions/chatModel/Commands/utilities/openlog";