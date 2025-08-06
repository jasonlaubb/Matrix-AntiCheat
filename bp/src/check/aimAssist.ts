import { Player } from "@minecraft/server";
import { addCheckInterval, removeCheckInterval } from "../util/tick";
import type { AimAssistData } from "../../../global";
import { fastAbs } from "../util/mathUtil";
export default {
    property: "antiAimAssistEnable",
    enable: () => {
        addCheckInterval(tickEvent);
    },
    disable: () => {
        removeCheckInterval(tickEvent);
    },
};
function tickEvent(player: Player) {
    const data =
        player?.aimAssistData ??
        ({
            lastYaw: 0,
            lastPitch: 0,
            lastDeltaYaw: 0,
            lastDeltaPitch: 0,
            lastFlagTimestamp: 0,
            flagAmount: {
                a: 0,
                b: 0,
                c: 0,
            },
        } as AimAssistData);
    const { x: pitch, y: yaw } = player.getRotation();
    const deltaYaw = fastAbs(yaw - data.lastYaw);
    const deltaPitch = fastAbs(pitch - data.lastPitch);
    const yawDifference = data.lastDeltaYaw;
    const pitchDifference = data.lastDeltaPitch;
    /**
        AimAssist A-D detection comes from Azure-Anticheat
        @links https://github.com/AimbotPvP/azure-anticheat/blob/master/src/main/java/us/skidrevenant/azure/check/checks/combat/aimassist/AimAssistA.java
     */
    if (deltaYaw > yawDifference && yawDifference > 0.3 && deltaPitch > 0 && deltaPitch <= pitchDifference && pitchDifference < 0.1) {
        data.flagAmount.a++;
        if (data.flagAmount.a >= 2) {
            player.flag("AimAssist", "A", "Combat", { deltaYaw, deltaPitch, yawDifference, pitchDifference });
        }
    } else if (data.flagAmount.a >= 0.01) data.flagAmount.a -= 0.01;
    if (deltaYaw > yawDifference && yawDifference > 0 && yawDifference < 0.1 && deltaPitch > 0.08) {
        data.flagAmount.b++;
        if (data.flagAmount.b >= 3) {
            player.flag("AimAssist", "B", "Combat", { deltaYaw, deltaPitch, yawDifference, pitchDifference });
        }
    } else if (data.flagAmount.b >= 0.015) data.flagAmount.b -= 0.015;
    if (deltaYaw > yawDifference && yawDifference > 0.0 && deltaPitch > 0 && deltaPitch < 0.02 && pitchDifference > deltaPitch * 2) {
        data.flagAmount.c++;
        if (data.flagAmount.c >= 2) {
            player.flag("AimAssist", "C", "Combat", { deltaYaw, deltaPitch, yawDifference, pitchDifference });
        }
    } else if (data.flagAmount.c >= 0.01) data.flagAmount.c -= 0.01;
    if (yawDifference > 0 && fastAbs(Math.floor(yawDifference) - yawDifference) < 0.0000000001) {
        player.flag("AimAssist", "D", "Combat", { deltaYaw, deltaPitch, yawDifference, pitchDifference });
    }
    player.onScreenDisplay.setActionBar(JSON.stringify(data.flagAmount));
    player.aimAssistData = {
        lastDeltaYaw: deltaYaw,
        lastDeltaPitch: deltaPitch,
        lastYaw: yaw,
        lastPitch: pitch,
        flagAmount: data.flagAmount,
    };
}
