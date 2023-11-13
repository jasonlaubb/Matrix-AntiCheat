import { world, system, Player } from "@minecraft/server";
import config from "../../Data/Config";
import { flag, isAdmin } from "../../Assets/Util";

/**
 * @author notthinghere
 * @description A advanced checks for aim, detect illegal aimming of aimbot clients
 */

class LastAction {
    rotation: Record<string, { x: number; y: number; rotationSpeed: { x: number; y: number }; averageSpeed: number }>;
}

class QueueFlag {
    [key: string]: { date: number };
}

let lastAction: LastAction = {
    rotation: {},
};

const timer = new Map<string, number>();

let queueFlag: QueueFlag = {};

async function AntiAim (player: Player) {
    const rotation = player.getRotation();
    const rotationSpeed = {x: Math.abs(rotation.x - (lastAction.rotation[player.id]?.x || rotation.x)), y: Math.abs(rotation.y - (lastAction.rotation[player.id]?.y || rotation.y))};
    const averageSpeed = Math.sqrt(rotationSpeed.x**2 + rotationSpeed.y**2);
    if (lastAction.rotation[player.id]) {
        const maxRotSpeed = config.antiAim.maxRotSpeed;
        if (averageSpeed > maxRotSpeed && queueFlag[player.id]) {
            const delay: number = Date.now() - queueFlag[player.id].date
            if (delay < 50) {
                flag (player, "Aim", config.antiAim.punishment, ["RotSpeed:" + averageSpeed.toFixed(2), "Delay:" + delay.toFixed(2)])
            }
        }

        if (rotationSpeed.x === rotationSpeed.y && rotationSpeed.x !== rotationSpeed.y || rotationSpeed.x > 1 && rotationSpeed.y < 0.6 || rotationSpeed.x < 0.6 && rotationSpeed.y > 1) {
            const timerSet = (timer.get(`aim-b:${player.id}`) || 0);
            timer.set(`aim-b:${player.id}`, timerSet + 1);
            if (timerSet > 30) {
                flag (player, "Aim", config.antiAim.punishment, ["RotSpeedX:" + rotationSpeed.x.toFixed(2), "RotSpeedY:" + rotationSpeed.y.toFixed(2)])
            }
        } else timer.set(`aim-b:${player.id}`, 0);
        
        if (averageSpeed > 0.1) {
            const checker = Math.abs(averageSpeed - lastAction.rotation[player.id].averageSpeed) > 0 && Math.abs(averageSpeed - lastAction.rotation[player.id].averageSpeed) <= 0.05;
            if (checker) {
                timer.set(`aim-c:${player.id}`, (timer.get(`aim-c:${player.id}`) || 0) + 1);
                if ((timer.get(`aim-c:${player.id}`) || 0) > 25) {
                    flag (player, "Aim", config.antiAim.punishment, ["RotSpeed:" + averageSpeed.toFixed(2)])
                }
            } else if (Math.abs(averageSpeed - lastAction.rotation[player.id].averageSpeed) > 0) {
                timer.set(`aim-c:${player.id}`, 0);
            }
        } else timer.set(`aim-c:${player.id}`, 0);
    }
    lastAction.rotation[player.id] = {...rotation, rotationSpeed, averageSpeed};
};

system.runInterval(() => {
    const toggle: boolean = (world.getDynamicProperty("antiAim") ?? config.antiAim.enabled) as boolean;
    if (toggle !== true) return;
    for (const player of world.getAllPlayers()) {
        if (isAdmin (player)) continue;
        AntiAim (player)
    }
}, 1)
        

world.afterEvents.itemStartUse.subscribe((event) => {
    const toggle: boolean = (world.getDynamicProperty("antiAim") ?? config.antiAim.enabled) as boolean;
    if (toggle !== true) return;
    const player = event.source;
    queueFlag[player.id] = {date: Date.now()};
});

world.afterEvents.entityHitEntity.subscribe((event) => {
    const toggle: boolean = (world.getDynamicProperty("antiAim") ?? config.antiAim.enabled) as boolean;
    if (toggle !== true) return;
    const {damagingEntity: player} = event;
    queueFlag[player.id] = {date: Date.now()};
});

world.afterEvents.playerLeave.subscribe(({ playerId }) => {
    delete lastAction.rotation[playerId];
    delete queueFlag[playerId];
    timer.delete(`aim-b:${playerId}`);
    timer.delete(`aim-c:${playerId}`);
});
