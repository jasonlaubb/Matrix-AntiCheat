/**
 * @author jasonlaubb
 * @contributors https://github.com/jasonlaubb/Matrix-AntiCheat?tab=readme-ov-file#developers
 * @license AGPLv3
 * @link https://github.com/jasonlaubb/Matrix-AntiCheat
 */
class MatrixAnti_MCPE {
    private static init = {
        initialized: false,
        runTime: Date.now(),
    };
    public constructor() {
        // Prevent the script from crashing
        Minecraft.system.beforeEvents.watchdogTerminate.subscribe(this.watchDogTerminate);
        // Initialize the matrix anticheat
        Minecraft.world.afterEvents.worldInitialize.subscribe(this.onWorldInitialize);
    }
    private readonly onWorldInitialize = async () => {
        const { world, system } = Minecraft;
        await initialize();
        MatrixAnti_MCPE.init.initialized = true;
        if (Dynamic.config().configDataBase.enabled) {
            await dataBaseInitialize();
        }
        // Launch the anticheat.
        await this.importAll()
            .catch((e) => console.error(e))
            .then(() => {
                // Log the initialization time.
                if (Dynamic.config().sendInitMsg) {
                    const initTakeTime = Date.now() - MatrixAnti_MCPE.init.runTime;
                    system.runTimeout(() => {
                        console.log("Matrix has been completely initialized in " + initTakeTime + "ms");
                    }, 40);
                    world.sendMessage({
                        rawtext: [
                            {
                                text: `§bMatrix §7>§g `,
                            },
                            {
                                translate: "index.complete",
                                with: [initTakeTime.toString()],
                            },
                        ],
                    });
                }
            })
            .finally(() => {
                console.warn("Matrix has been loaded on " + new Date(Date.now()).toISOString());
            });
        // Unsubscribe from the events.
        Minecraft.world.afterEvents.worldInitialize.unsubscribe(this.onWorldInitialize);
        return;
    };
    private watchDogTerminate(event: Minecraft.WatchdogTerminateBeforeEvent) {
        event.cancel = true;
    }
    private readonly importAll = async () => {
        // Assets
        await import("./Assets/LatinNormalize");
        await import("./Assets/Language");
        await import("./Functions/Config/dynamic_config")
        await import("./Assets/Util");
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
        await import("./Functions/chatModel/Commands/moderations/warn");
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
        await import("./Functions/chatModel/Commands/pcommands/report");
        // Register the modules
        Minecraft.world.modules = [];
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
        // Use the register data to initialize the modules
        const sucessAmount = await intilizeModules();
        const config = await Dynamic.configAsync();
        if (config.sendModuleInitMsg)
            Minecraft.world.sendMessage({
                rawtext: [
                    {
                        text: `§bMatrix §7>§g `,
                    },
                    {
                        translate: "index.initmodules",
                        with: [sucessAmount.toString(), (Date.now() - MatrixAnti_MCPE.init.runTime).toString()],
                    },
                ],
            });
        if (config.createScoreboard && !Minecraft.world.scoreboard.getObjective("matrix:api")) {
            Minecraft.world.scoreboard.addObjective("matrix:api", "").setScore("matrix:beta-api-enabled", -2048);
        }
        return;
    };
    public get initialized(): boolean {
        return MatrixAnti_MCPE.init.initialized;
    }
    public get initializeDate(): number {
        return MatrixAnti_MCPE.init.runTime;
    }
    public readonly initializeAsync = () =>
        new Promise<void>((resolve) => {
            const runId = Minecraft.system.runInterval(() => {
                if (MatrixAnti_MCPE.init.initialized) {
                    resolve();
                    Minecraft.system.clearRun(runId);
                }
            }, 1);
        });
}
const Index = new MatrixAnti_MCPE();
export default Index;
import * as Minecraft from "@minecraft/server";
import { initialize } from "./Functions/Config/dynamic_config";
import { intilizeModules } from "./Modules/Modules";
import Dynamic from "./Functions/Config/dynamic_config";
import { dataBaseInitialize } from "./Functions/Config/config_database";