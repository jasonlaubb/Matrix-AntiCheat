class MatrixAnti_MCPE {
    private static init = {
        initialized: false,
        runTime: Date.now(),
    };
    public constructor () {
        import("@minecraft/debug-utilities")
            .then((debug) => {
                debugImport = debug.disableWatchdogTimingWarnings;
                debugImport(true);
            })
            .catch((_error) => console.warn("Index :: server is not allowing debug utilities"))
            .finally(() => {
                Minecraft.system.beforeEvents.watchdogTerminate.subscribe(this.watchDogTerminate);
                Minecraft.world.afterEvents.worldInitialize.subscribe(this.onWorldInitialize);
            });
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
            .catch((e) => {
                new Promise<void>(resolve => {
                    const id = system.runInterval(() => {
                        if (world.getAllPlayers().length > 0) {
                            resolve();
                            system.clearRun(id);
                        }
                    }, 100);
                }).then(() => {
                    world.sendMessage({ rawtext: [
                        {
                            translate: "index.importerror",
                            with: []
                        }
                    ]});
                })
                sendErr(e);
            })
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
        await import("./Functions/Config/dynamic_config");
        await import("./Assets/Util");
        await import("./Assets/Public");
        // Script unctions
        await import("./Functions/chatModel/ChatHandler");
        await import("./Functions/moderateModel/banHandler");
        await import("./Functions/moderateModel/freezeHandler");
        await import("./Functions/moderateModel/dimensionLock");
        await import("./Functions/moderateModel/lockDown");
        await import("./Functions/moderateModel/log");
        await import("./Functions/moderateModel/invPicker");
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
        await import("./Functions/chatModel/Commands/moderations/invof");
        await import("./Functions/chatModel/Commands/moderations/vanish");
        await import("./Functions/chatModel/Commands/moderations/unvanish");
        await import("./Functions/chatModel/Commands/moderations/warn");
        await import("./Functions/chatModel/Commands/moderations/directaction");
        await import("./Functions/chatModel/Commands/moderations/timeout");
        await import("./Functions/chatModel/Commands/settings/toggles");
        await import("./Functions/chatModel/Commands/settings/toggle");
        await import("./Functions/chatModel/Commands/settings/setpassword");
        await import("./Functions/chatModel/Commands/settings/clearpassword");
        await import("./Functions/chatModel/Commands/moderations/setadmin");
        await import("./Functions/chatModel/Commands/moderations/deladmin");
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
        await import("./Functions/chatModel/Commands/utilities/runcommand");
        await import("./Functions/chatModel/Commands/utilities/gm");
        await import("./Functions/chatModel/Commands/utilities/fakeleave");
        await import("./Functions/chatModel/Commands/utilities/ping");
        await import("./Functions/chatModel/Commands/utilities/tps");
        await import("./Functions/chatModel/Commands/pcommands/report");
        // Register the modules
        Minecraft.world.modules = [];
        await import("./Core/Combat/Auto Clicker");
        await import("./Core/Combat/MobAura");
        await import("./Core/Combat/Kill Aura");
        await import("./Core/Combat/Reach");
        await import("./Core/Combat/Aim");
        await import("./Core/Misc/Spammer");
        await import("./Core/Movement/Fly");
        await import("./Core/Movement/NoFall");
        await import("./Core/Movement/Timer");
        await import("./Core/Movement/Phase");
        await import("./Core/Movement/Motion");
        await import("./Core/Movement/BdsPrediction");
        await import("./Core/Movement/Speed");
        await import("./Core/Movement/NoSlow");
        await import("./Core/World/Nuker");
        await import("./Core/World/Scaffold");
        await import("./Core/World/Tower");
        await import("./Core/World/Breaker");
        await import("./Core/Player/Illegal Item");
        await import("./Core/Player/NameSpoof");
        await import("./Core/Player/FastUse");
        await import("./Core/Player/GameMode");
        await import("./Core/World/AutoTool");
        await import("./Core/World/FastBreak");
        await import("./Core/Misc/Xray");
        await import("./Core/Movement/World Border");
        await import("./Core/Misc/Disabler");
        await import("./Core/Misc/NoSwing");
        await import("./Core/Misc/Badpacket");
        await import("./Core/Utility/Welcomer");
        await import("./Core/Utility/Defender");
        await import("./Core/Utility/AntiAFK");
        await import("./Core/Utility/AntiGrief");
        //await import("./Core/Movement/Air Jump"); // Not ready yet
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
        if (debugImport) Minecraft.system.runTimeout(() => {
            debugImport(false);
        }, 200);
        return;
    };
    public get initialized(): boolean {
        return MatrixAnti_MCPE.init.initialized;
    }
    public get initializeDate(): number {
        return MatrixAnti_MCPE.init.runTime;
    }
    public readonly initializeAsync = () => onceTrue(undefined, () => MatrixAnti_MCPE.init.initialized, -1);
}
const Index = new MatrixAnti_MCPE();
export default Index;
let debugImport: any;
import * as Minecraft from "@minecraft/server";
import { initialize } from "./Functions/Config/dynamic_config";
import { intilizeModules } from "./Core/Modules";
import Dynamic from "./Functions/Config/dynamic_config";
import { dataBaseInitialize } from "./Functions/Config/config_database";
import { onceTrue } from "./Assets/Util";
import { sendErr } from "./Functions/chatModel/CommandHandler";
//import { disableWatchdogTimingWarnings } from "@minecraft/debug-utilities";
