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
    }
}
function tickEvent (player: Player) {
    const data = player?.aimAssistData ?? {
        lastYaw: 0,
        lastPitch: 0,
        lastDeltaYaw: 0,
        lastDeltaPitch: 0,
    } as AimAssistData;
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
        player.flag("AimAssist", "A", "Combat", { deltaYaw, deltaPitch, yawDifference, pitchDifference });
    }
    if (deltaYaw > yawDifference && yawDifference > 0 && yawDifference < 0.1 && deltaPitch > 0.08) {
        player.flag("AimAssist", "B", "Combat", { deltaYaw, deltaPitch, yawDifference, pitchDifference });
    }
    if (deltaYaw > yawDifference && yawDifference > 0.0 && deltaPitch > 0 && deltaPitch < 0.02 && pitchDifference > deltaPitch * 2) {
        player.flag("AimAssist", "C", "Combat", { deltaYaw, deltaPitch, yawDifference, pitchDifference });
    }
    if (yawDifference > 0 && fastAbs(Math.floor(yawDifference) - yawDifference) < 0.0000000001) {
        player.flag("AimAssist", "D", "Combat", { deltaYaw, deltaPitch, yawDifference, pitchDifference });
    }
    player.aimAssistData = {
        lastDeltaYaw: deltaYaw,
        lastDeltaPitch: deltaPitch,
        lastYaw: yaw,
        lastPitch: pitch,
    };
}