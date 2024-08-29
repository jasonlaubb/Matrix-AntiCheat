import { Player } from "@minecraft/server";
import { flag } from "../../Assets/Util";
import { registerModule, configi } from "../Modules";
import { AnimationControllerTags } from "../../Data/EnumData";
/**
 * @author jasonlaubb && RaMiGamerDev
 * @description Detect the suspicious aiming
 */

function disableAllActions(player: Player){
    if (player.hastTag("matrix:pvp-disabled")) return
   player.addTag(`matrix:pvp-disabled`)
   player.addTag(`matrix:place-disabled`)
   player.addTag(`matrix:break-disabled`)
 system.runTimeout(() => {
    player.removeTag(`matrix:pvp-disabled`)
    player.removeTag(`matrix:place-disabled`)
    player.removeTag(`matrix:break-disabled`)
 }, 160)
}
const aimData: Map<string, AimData> = new Map();

function antiAim(config: configi, player: Player) {
    const data = aimData.get(player.id);
    const { x: rotationX, y: rotationY } = player.getRotation();
    if (!data) {
        aimData.set(player.id, {
            aimBFlags: 0,
            aimAFlags: 0,
            lastRotationX: rotationX,
            lastRotationY: rotationY,
            previousRotationX: undefined,
            previousRotationY: undefined,
            vibrateRotContinue: 0,
            lastRotDifferent: 0,
        });
        return;
    } else if (!data?.previousRotationX || player.getComponent("riding")?.entityRidingOn || player.isSleeping || player.isSwimming || player.isGliding) {
        aimData.set(player.id, {
            aimBFlags: 0,
            aimAFlags: 0,
            lastRotationX: rotationX,
            lastRotationY: rotationY,
            previousRotationX: undefined,
            previousRotationY: undefined,
            similarRotContinue: 0,
            lastRotDifferent: 0,
        });
        return;
    }
    const rotSpeedX = Math.abs(rotationX - data.lastRotationX);
    const rotSpeedY = Math.abs(rotationY - data.lastRotationY);
    const lastRotSpeedX = Math.abs(rotationX - data.previousRotationX);
    const lastRotSpeedY = Math.abs(rotationY - data.previousRotationY!);
    let flagged
    // Integer rotation
    if (rotationX == rotationX.toFixed(2) && (rotationX != 0 || rotationX == 0 && rotSpeedY > 1) || rotationY == rotationY.toFixed(2) && (rotationY != 0 || rotationY == 0 && rotSpeedX > 0 )) {
        data.aimAFlags++
        if (data.aimAFlags > 1 || !(rotationX == 0 && rotSpeedY > 1 || rotationY == 0 && rotSpeedX > 1)) {
           flag(player, "Aim", "A", config.antiAim.maxVL, config.antiAim.punishment, [(">RotationX") + ":" + rotationX, (">RotationY") + ":" + rotationY]);
           flagged = true
           data.aimAFlags = 0
        }
    } else data.aimAFlags = 0
    // smooth rotation
    if ((rotSpeedX > 0.0001 && rotSpeedX < 1 && (rotSpeedY > 0.7 || rotSpeedY < 0.1) || rotSpeedY > 0.0001 && rotSpeedY < 1 && (rotSpeedX > 0.7 || rotSpeedX < 0.1)) && !(rotSpeedX > 7 || rotSpeedY > 14)) {
        data.aimBFlags++
        if (data.aimBFlags >= 20) {
           flag(player, "Aim", "B", config.antiAim.maxVL, config.antiAim.punishment, [(">RotSpeedX") + ":" + rotSpeedX, (">RotSpeedY") + ":" + rotSpeedY]);
           data.aimBFlags = 0
           flagged = true
        }
    } else data.aimBFlags = 0
    // Straight rotation movement
    if (lastRotSpeedY - rotSpeedY > 0 && data.lastRotDifferent < 0 || lastRotSpeedY - rotSpeedY < 0 && data.lastRotDifferent > 0) {
        data.vibrateRotContinue++;
        if (data.vibrateRotContinue >= 15) {
            flag(player, "Aim", "E", config.antiAim.maxVL, config.antiAim.punishment, [(">RotSpeedX") + ":" + rotSpeedX, (">RotSpeedY") + ":" + rotSpeedY]);
            data.vibrateRotContinue = 0;
            flagged = true
        }
    }
    else
        data.vibrateRotContinue = 0;
    data.lastRotDifferent = rotationX - data.lastRotationX;
    if (flagged) disableAllActions(player)
    aimData.set(player.id, {
        aimBFlags: 0,
        aimAFlags: 0,
        lastRotationX: rotationX,
        lastRotationY: rotationY,
        previousRotationX: data.lastRotationX,
        previousRotationY: data.lastRotationY,
        vibrateRotContinue: data.vibrateRotContinue,
        lastRotDifferent: Math.abs(rotationX - data.lastRotationX),
    });
}

interface AimData {
    aimBFlags: number,
    aimAFlags: number,
    lastRotationX: number;
    lastRotationY: number;
    previousRotationX?: number;
    previousRotationY?: number;
    vibrateRotContinue: number;
    lastRotDifferent: number;
}

// Register the module.
registerModule("antiAim", false, [aimData], {
    intick: async (config: configi, player: Player) => antiAim(config, player),
    tickInterval: 1,
});
