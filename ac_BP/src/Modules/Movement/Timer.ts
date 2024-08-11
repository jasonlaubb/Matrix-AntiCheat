import { Player, Vector3 } from "@minecraft/server";
import { bypassMovementCheck, c, flag } from "../../Assets/Util.js";
import { isSpikeLagging, tps } from "../../Assets/Public.js";
import { configi, registerModule } from "../Modules.js";
import { AnimationControllerTags } from "../../Data/EnumData.js";
import { freezeTeleport } from "./NoClip.js";
interface timerData {
    safeZone: Vector3;
    lastFlag: number;
    locationData: {
        location: Vector3;
        recordTime: number;
    };
    lastTickPos: Vector3;
    maxDBVD: number;
    xzLog: number;
    disLog: number;
    timerLog: number;
    yLog: number;
    yDisLog: number;
    lastHighTeleport: number;
}
const timerData = new Map<string, timerData>();
/** @description Return that player is spike lagging */
/**
 * @author RamiGamerDev
 * @description Checks if the player moved without the same between velocity and moved distance.
 */
export async function AntiTimer(config: configi, player: Player, now: number) {
    const data = timerData.get(player.id) ?? ({} as timerData);
    //skip the code for some reasons
    if (player.isGliding || player.hasTag(AnimationControllerTags.riding)) return;
    //dBVD == difference between velocity and moved distance
    const dBVD = Math.abs(data.xzLog - data.disLog);
    const dBVD2 = data.yDisLog - data.yLog;
    //setting max value of dBVD
    data.maxDBVD = 20 / tps.getTps()!;
    //check if dBVD lower than 1 and higher than 0.5 add one to timerLog and when timerLog reach 3 flag (check for low timer)
    if ((dBVD < data.maxDBVD && dBVD > 20 / (tps.getTps()! * 2)) || (dBVD2 < data.maxDBVD && dBVD2 > 20 / (tps.getTps()! * 2))) data.timerLog++;
    else data.timerLog = 0;
    //flag time if dBVD is greater than 1 blocks or timerLog reach 3 (low timer will flag in 3 secs probably but maybe i will downgrade the max from 1 to 1 after make sure no falses)
    if (!bypassMovementCheck(player) && now - data.lastHighTeleport >= config.antiTimer.tickMovementCooldown && (((dBVD > data.maxDBVD || dBVD2 > data.maxDBVD) && now - data.lastFlag >= 1025) || data.timerLog >= config.antiTimer.minTimerLog)) {
        //dBLFN = difference between last flag time and now
        const dBLFN = now - data.lastFlag;
        //if the dBLFN is lower than the given value flag
        if (!isSpikeLagging(player) && ((dBLFN < 5000 && data.timerLog >= 3) || (dBLFN < 2000 && dBVD > data.maxDBVD)))
            flag(player, "Timer", "A", config.antiTimer.maxVL, config.antiTimer.punishment, ["blockPerSecond" + ":" + (data.disLog * 2).toFixed(2)]);
        //lag back the player
        freezeTeleport(player, data.safeZone);
        //setting new lastFlag
        data.lastFlag = now;
    }
    //saving new location if the player didnt got flagged
    if (dBVD < 0.5) data.safeZone = player.location;
    //reseting logs to 0
    data.xzLog = 0;
    data.yLog = 0;
    data.disLog = 0;
    data.yDisLog = 0;
}
/** @description For Anti Timer */
export async function SystemEvent(player: Player, now: number) {
    const data = timerData.get(player.id) ?? ({} as timerData);
    //getting data
    const locdata = data.locationData ?? { location: player.location, recordTime: now };
    //skip the code for for some reasons
    data.locationData = { location: player.location, recordTime: now };
    data.lastHighTeleport ??= 0;
    data.lastTickPos ??= player.location;
    const distance = Math.hypot(player.location.x - data.lastTickPos.x, player.location.z - data.lastTickPos.z);
    data.lastTickPos = player.location;
    if (distance > c().antiTimer.maxTickMovment) data.lastHighTeleport = now;
    //just defineing everything we need
    const { x: x1, y: y1, z: z1 } = player.location;
    const { x: x2, y: y2, z: z2 } = locdata.location;
    const { x, y, z } = player.getVelocity();
    const xz = Math.hypot(x, z);
    //define everything if everything is undefined
    if (data.timerLog == undefined || Number.isNaN(data.timerLog)) {
        data.xzLog = 0;
        data.timerLog = 0;
        data.disLog = 0;
        data.maxDBVD = 0;
        data.yLog = 0;
        data.yDisLog = 0;
        data.safeZone = player.location;
        data.lastFlag = Date.now();
    }
    //just logging every velocity or moved distance in 20 ticks
    data.xzLog += xz;
    if (y > 0) {
        data.yLog += Math.abs(y);
        data.yDisLog += Math.abs(y1 - y2);
    }
    data.disLog += Math.hypot(x1 - x2, z1 - z2);
    //reset velocity xz log and distance log if player used /tp or using high y velocity
    if ((xz == 0 && Math.hypot(x1 - x2, z1 - z2) > 0.5) || player.hasTag(AnimationControllerTags.riding) || player.isGliding) {
        data.xzLog = 0;
        data.disLog = 0;
    }
    //reset anti y timer if player used /tp or using high velocity
    if ((y == 0 && Math.abs(y1 - y2) > 0.1) || y > 0.5 || player.hasTag(AnimationControllerTags.riding)) data.yDisLog = 0;
    timerData.set(player.id, data);
}

registerModule(
    "antiTimer",
    false,
    [timerData],
    {
        intick: async (config, player) => AntiTimer(config, player, Date.now()),
        tickInterval: 20,
    },
    {
        intick: async (_config, player) => SystemEvent(player, Date.now()),
        tickInterval: 1,
    }
);
