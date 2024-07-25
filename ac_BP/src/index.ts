/**
 * @author jasonlaubb
 * @contributors ravriv, Hutao999999, RaMiGamerDev, notthinghere
 * @translate amico_nabbo, kris02, Selder578
 * @license AGPLv3
 * @link https://github.com/jasonlaubb/Matrix-AntiCheat
 */

const init = {
    initialized: false,
    runTime: Date.now()
};
Minecraft.system.beforeEvents.watchdogTerminate.subscribe((event) => {
    event.cancel = true;
});
Minecraft.world.afterEvents.worldInitialize.subscribe(async () => {
    // Initialize the anticheat.
    initialize();
    init.initialized = true;
    Minecraft.world.modules = [];
    const config = Dynamic.config();
    if (config.createScoreboard && !Minecraft.world.scoreboard.getObjective("matrix:api")) {
        Minecraft.world.scoreboard.addObjective("matrix:api", "").setScore("matrix:beta-api-enabled", -2048);
    }
    // Import the import
    await importModules()
    const moduleAmount = await intilizeModules()

    if (config.sendModuleInitMsg) Minecraft.world.sendMessage({ rawtext: [
        {
            text: `§bMatrix §7>§g `
        },
        {
            translate: "index.initmodules",
            with: [moduleAmount.toString(), (Date.now() - init.runTime).toString()]
        }
    ]});

    if (config.sendInitMsg) {
        const initTakeTime = Date.now() - init.runTime;
        Minecraft.system.runTimeout(() => {
            console.warn("Matrix has been completely initialized in " + initTakeTime + "ms");
        }, 40);
        Minecraft.world.sendMessage("§bMatrix §7>§g Matrix has been completely initialized in " + initTakeTime + "ms");
    }
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
        return init.runTime;
    }
}

export const ob = new Object();

// All the file need to be launched
async function importModules() {
    // Assets
    await import("./Assets/LatinNormalize");
    await import("./Assets/Language");
    await import("./Assets/Public");
    // Script unctions
    await import("./Functions/chatModel/ChatHandler");
    await import("./Functions/moderateModel/banHandler");
    await import("./Functions/moderateModel/freezeHandler");
    await import("./Functions/moderateModel/dimensionLock");
    await import("./Functions/moderateModel/lockDown");
    await import("./Functions/moderateModel/log");
    // Register commands
    await import("./Functions/chatModel/Commands/helps/about");
    await import("./Functions/chatModel/Commands/helps/help");
    await import("./Functions/chatModel/Commands/moderations/op");
    await import("./Functions/chatModel/Commands/moderations/deop");
    await import("./Functions/chatModel/Commands/moderations/rank");
    await import("./Functions/chatModel/Commands/moderations/rankclear");
    await import("./Functions/chatModel/Commands/moderations/ban");
    await import("./Functions/chatModel/Commands/moderations/banqueue");
    await import("./Functions/chatModel/Commands/moderations/bypasslist");
    await import("./Functions/chatModel/Commands/moderations/unban");
    await import("./Functions/chatModel/Commands/moderations/tempkick");
    await import("./Functions/chatModel/Commands/moderations/mute");
    await import("./Functions/chatModel/Commands/moderations/unmute");
    await import("./Functions/chatModel/Commands/moderations/echestwipe");
    await import("./Functions/chatModel/Commands/moderations/freeze");
    await import("./Functions/chatModel/Commands/moderations/unfreeze");
    await import("./Functions/chatModel/Commands/moderations/invsee");
    await import("./Functions/chatModel/Commands/moderations/invcopy");
    await import("./Functions/chatModel/Commands/moderations/vanish");
    await import("./Functions/chatModel/Commands/moderations/unvanish");
    await import("./Functions/chatModel/Commands/settings/toggles");
    await import("./Functions/chatModel/Commands/settings/toggle");
    await import("./Functions/chatModel/Commands/settings/passwords");
    await import("./Functions/chatModel/Commands/settings/flagmode");
    await import("./Functions/chatModel/Commands/settings/defaultrank");
    await import("./Functions/chatModel/Commands/settings/showallrank");
    await import("./Functions/chatModel/Commands/settings/reset");
    await import("./Functions/chatModel/Commands/settings/banrun");
    await import("./Functions/chatModel/Commands/settings/lockdown");
    await import("./Functions/chatModel/Commands/settings/lockdowncode");
    await import("./Functions/chatModel/Commands/settings/unlock");
    await import("./Functions/chatModel/Commands/settings/antispam");
    await import("./Functions/chatModel/Commands/settings/config");
    await import("./Functions/chatModel/Commands/settings/setutil");
    await import("./Functions/chatModel/Commands/settings/setprefix");
    await import("./Functions/chatModel/Commands/utilities/adminchat");
    await import("./Functions/chatModel/Commands/utilities/itemui");
    await import("./Functions/chatModel/Commands/utilities/matrixui");
    await import("./Functions/chatModel/Commands/utilities/openlog");
    await import("./Functions/chatModel/Commands/utilities/packetlogger");
    // Register the modules
    await import("./Modules/Combat/Auto Clicker");
    await import("./Modules/Combat/Kill Aura");
    await import("./Modules/Combat/Reach");
    await import("./Modules/Combat/Aim");
    await import("./Modules/Misc/Spammer");
    await import("./Modules/Movement/Fly");
    await import("./Modules/Movement/NoFall");
    await import("./Modules/Movement/Timer");
    await import("./Modules/Movement/NoClip");
    await import("./Modules/Movement/Speed");
    await import("./Modules/Movement/NoSlow");
    await import("./Modules/Movement/ElytraFly");
    await import("./Modules/World/Nuker");
    await import("./Modules/World/Scaffold");
    await import("./Modules/World/Tower");
    await import("./Modules/World/Breaker");
    await import("./Modules/Player/Illegal Item");
    await import("./Modules/Player/NameSpoof");
    await import("./Modules/Player/FastUse");
    await import("./Modules/Player/GameMode");
    await import("./Modules/World/AutoTool");
    await import("./Modules/Misc/Bot");
    await import("./Modules/World/FastBreak");
    await import("./Modules/Misc/Xray");
    await import("./Modules/Movement/World Border");
    await import("./Modules/Misc/Disabler");
    await import("./Modules/Movement/ClientAuth");
}
import * as Minecraft from "@minecraft/server";
import { initialize } from "./Functions/Config/dynamic_config";
import { intilizeModules } from "./Modules/Modules";
import Dynamic from "./Functions/Config/dynamic_config";