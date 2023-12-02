import { world, system, Player, ItemStartUseAfterEvent, PlayerLeaveAfterEvent } from "@minecraft/server";
import { flag, isAdmin, c } from "../../Assets/Util";
import lang from "../../Data/Languages/lang";

/**
 * @author notthinghere
 * @description A advanced checks for aim, detect illegal aimming of aimbot clients
 */

interface LastAction {
    rotation: Record<string, { x: number; y: number; rotationSpeed: { x: number; y: number }; averageSpeed: number }>;
}

interface QueueFlag {
    [key: string]: { date: number };
}

let lastAction: LastAction = {
    rotation: {},
};

const timer = new Map<string, number>();

let queueFlag: QueueFlag = {};

async function AntiAim (player: Player) {
    const config = c()
    const rotation = player.getRotation();
    const rotationSpeed = {x: Math.abs(rotation.x - (lastAction.rotation[player.id]?.x || rotation.x)), y: Math.abs(rotation.y - (lastAction.rotation[player.id]?.y || rotation.y))};
    const averageSpeed = Math.sqrt(rotationSpeed.x ** 2 + rotationSpeed.y ** 2);
    if (lastAction.rotation[player.id]) {
        let isFlagged = false;
        const maxRotSpeed = config.antiAim.maxRotSpeed;
        if (averageSpeed > maxRotSpeed && queueFlag[player.id]) {
            const delay: number = Date.now() - queueFlag[player.id].date
            if (delay < 50) {
                isFlagged = true
                flag (player, "Aim", "A", config.antiAim.maxVL, config.antiAim.punishment, [lang(">RotSpeed") + ":" + averageSpeed.toFixed(2), "Delay:" + delay.toFixed(2)])
            }
        }

        if (rotationSpeed.x === rotationSpeed.y && rotationSpeed.x !== rotationSpeed.y || rotationSpeed.x > 1 && rotationSpeed.y < 0.6 || rotationSpeed.x < 0.6 && rotationSpeed.y > 1) {
            const timerSet = (timer.get(`aim-b:${player.id}`) || 0);
            timer.set(`aim-b:${player.id}`, timerSet + 1);
            if (timerSet > 30) {
                isFlagged = true
                flag (player, "Aim", "B", config.antiAim.maxVL, config.antiAim.punishment, [lang(">RotSpeedX") + ":" + rotationSpeed.x.toFixed(2), lang(">RotSpeedY") + ":" + rotationSpeed.y.toFixed(2)])
            }
        } else timer.set(`aim-b:${player.id}`, 0);
        
        if (averageSpeed > 0.1) {
            const checker = Math.abs(averageSpeed - lastAction.rotation[player.id].averageSpeed) > 0 && Math.abs(averageSpeed - lastAction.rotation[player.id].averageSpeed) <= 0.05;
            if (checker) {
                timer.set(`aim-c:${player.id}`, (timer.get(`aim-c:${player.id}`) || 0) + 1);
                if ((timer.get(`aim-c:${player.id}`) || 0) > 25) {
                    isFlagged = true
                    flag (player, "Aim", "C", config.antiAim.maxVL, config.antiAim.punishment, [lang(">RotSpeed") + ":" + averageSpeed.toFixed(2)])
                }
            } else if (Math.abs(averageSpeed - lastAction.rotation[player.id].averageSpeed) > 0) {
                timer.set(`aim-c:${player.id}`, 0);
            }
        } else timer.set(`aim-c:${player.id}`, 0);

        if (isFlagged) {
            if (!config.slient) {
                player.applyDamage(6)
                if (!player.hasTag("matrix:pvp-disabled")) {
                    player.addTag("matrix:pvp-disabled")
                    system.runTimeout(() => player.removeTag("matrix:pvp-disabled"), config.antiAim.timeout)
                }
            }
        }
    }
    lastAction.rotation[player.id] = {...rotation, rotationSpeed, averageSpeed};
};

const antiAim = () => {
    const players = world.getAllPlayers();
    for (const player of players) {
        if (isAdmin (player)) continue;
        AntiAim (player)
    }
}
        

const itemStartUse = (event: ItemStartUseAfterEvent) => {
    const player = event.source;
    queueFlag[player.id] = {date: Date.now()};
};

const playerLeave = ({ playerId }: PlayerLeaveAfterEvent) => {
    delete lastAction.rotation[playerId];
    delete queueFlag[playerId];
    timer.delete(`aim-b:${playerId}`);
    timer.delete(`aim-c:${playerId}`);
};

let id: number

export default {
    enable () {
        id = system.runInterval(antiAim, 1)
        world.afterEvents.itemStartUse.subscribe(itemStartUse)
        world.afterEvents.playerLeave.subscribe(playerLeave)
    },
    disable () {
        lastAction = { rotation: {} };
        queueFlag = {};
        timer.clear();
        system.clearRun(id)
        world.afterEvents.itemStartUse.unsubscribe(itemStartUse)
        world.afterEvents.playerLeave.unsubscribe(playerLeave)
    }
}