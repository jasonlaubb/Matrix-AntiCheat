import { Player, PlayerLeaveAfterEvent, system, world } from "@minecraft/server";
import { c, flag, isAdmin } from "../../Assets/Util";
import lang from "../../Data/Languages/lang";
const aimData: Map<string, AimData> = new Map();

function AntiAim (player: Player) {
    const data = aimData.get(player.id)
    const { x: rotationX, y: rotationY } = player.getRotation();
    if (!aimData) {
        aimData.set(player.id, { lastRotationX: rotationX, lastRotationY: rotationY, previousRotationX: undefined, previousRotationY: undefined, strightRotContinue: 0, vibrateRotContinue: 0, lastRotDifferent: 0 });
        return;
    } else if (!data?.previousRotationX) {
        aimData.set(player.id, { lastRotationX: rotationX, lastRotationY: rotationY, previousRotationX: data.lastRotationX, previousRotationY: data.lastRotationY, strightRotContinue: data.strightRotContinue, vibrateRotContinue: data.vibrateRotContinue, lastRotDifferent: 0 });
    }
    const rotSpeedX = Math.abs(rotationX - data.lastRotationX);
    const rotSpeedY = Math.abs(rotationY - data.lastRotationY);
    const lastRotSpeedX = Math.abs(rotationX - data.previousRotationX);
    const lastRotSpeedY = Math.abs(rotationY - data.previousRotationY);
    const config = c();
    // Integer rotation
    if ((rotationX % 5 == 0 && rotationX != 0 && !player.hasTag("matrix:riding") && Math.abs(rotationX) != 90) || (rotationY % 5 == 0 && rotationY != 0)) {
        flag (player, "Aim", "A", config.antiAim.maxVL, config.antiAim.punishment, [lang(">RotationX") + ":" + rotationX, lang(">RotationY") + ":" + rotationY]);
    }
    // Interger rot speed
    if ((rotSpeedX % 1 == 0 && rotSpeedX != 0) || rotSpeedY % 1 == 0 && rotSpeedY != 0) {
        flag (player, "Aim", "B", config.antiAim.maxVL, config.antiAim.punishment, [lang(">RotSpeedX") + ":" + rotSpeedX, lang(">RotSpeedY") + ":" + rotSpeedY]);
    }
    // Stright rotation movement
    if (rotSpeedY > 10 && rotSpeedX < 0.05 && !player.hasTag("matrix:riding")) {
        data.strightRotContinue++;
        if (data.strightRotContinue > 15) {
            flag (player, "Aim", "C", config.antiAim.maxVL, config.antiAim.punishment, [lang(">RotSpeedX") + ":" + rotSpeedX, lang(">RotSpeedY") + ":" + rotSpeedY]);
        }
    } else data.strightRotContinue = 0;
    // Similar rotation movement
    if (Math.abs(lastRotSpeedY - rotSpeedY) > 39.5 && Math.abs(lastRotSpeedX - rotSpeedX) < 0.01 && !player.hasTag("matrix:riding")) {
        flag (player, "Aim", "D", config.antiAim.maxVL, config.antiAim.punishment, [lang(">RotSpeedX") + ":" + rotSpeedX, lang(">RotSpeedY") + ":" + rotSpeedY]);
    }
    // Vibrate rotation movement
    if (lastRotSpeedX - rotSpeedY > 0 && data.lastRotDifferent < 0 || lastRotSpeedX - rotSpeedY < 0 && data.lastRotDifferent > 0) {
        data.vibrateRotContinue++;
        if (data.vibrateRotContinue >= 2) {
            flag (player, "Aim", "E", config.antiAim.maxVL, config.antiAim.punishment, [lang(">RotSpeedX") + ":" + rotSpeedX, lang(">RotSpeedY") + ":" + rotSpeedY]);
        }
    } else data.vibrateRotContinue = 0;

    aimData.set(player.id, { lastRotationX: rotationX, lastRotationY: rotationY, previousRotationX: data.lastRotationX, previousRotationY: data.lastRotationY, strightRotContinue: data.strightRotContinue, vibrateRotContinue: data.vibrateRotContinue, lastRotDifferent: Math.abs(rotationX - data.lastRotationX) });
}
function playerLeaveAfterEvent ({ playerId }: PlayerLeaveAfterEvent) {
    aimData.delete(playerId);
}
function antiAim () {
    const allPlayers = world.getAllPlayers();
    for (const player of allPlayers) {
        if (isAdmin(player)) continue;
        AntiAim (player);
    }
}
let id: number;
export default {
    enable () {
        id = system.runInterval(antiAim, 1);
        world.afterEvents.playerLeave.subscribe(playerLeaveAfterEvent);
    },
    disable () {
        aimData.clear()
        system.clearRun(id);
        world.afterEvents.playerLeave.unsubscribe(playerLeaveAfterEvent);
    }
}
interface AimData {
    lastRotationX: number;
    lastRotationY: number;
    previousRotationX: number;
    previousRotationY: number;
    strightRotContinue: number;
    vibrateRotContinue: number;
    lastRotDifferent: number;
}