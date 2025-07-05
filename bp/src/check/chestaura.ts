import { Container, PlayerInteractWithBlockBeforeEvent, system, world } from "@minecraft/server";
import { calculateRelativeViewAngle, distanceXZ } from "../util/mathUtil";
export default {
    enable() {
        world.beforeEvents.playerInteractWithBlock.subscribe(interact);
    },
    disable() {
        world.beforeEvents.playerInteractWithBlock.unsubscribe(interact);
    }
}
function interact (event: PlayerInteractWithBlockBeforeEvent) {
    const inventory = event.block.getComponent("inventory");
    if (!inventory || distanceXZ(event.player.location, event.block.location) < 2) return;
    const angle = calculateRelativeViewAngle(event.player.location, event.block.center(), event.player.getRotation().y);
    system.run(() => event.player.sendMessage(angle.toString()));
    if (angle > (event.player.inputInfo.lastInputModeUsed === "Touch" ? 120 : 30)) {
        event.cancel = true;
        system.run(() => event.player.flag("ChestAura", "A", "Player", { angle: angle.toFixed(2) }));
        return;
    }
    const container = inventory.container!;
    const containerFirstItem = container.firstItem();
    if (containerFirstItem !== undefined) {
        const stackAmount = stackInventoryItem(container);
        system.run(() => event.player.sendMessage("StartChecking... Weight: " + stackAmount));
        const now = Date.now();
        event.player.chestauraLastLostIndex = containerFirstItem;
        const maxTime = stackAmount * 300;
        new Promise<number | null>((res) => {
            const id = system.runInterval(() => {
                const firstItem = container.firstItem();
                const current = Date.now();
                if (firstItem === undefined) {
                    res((current - now) / stackAmount);
                    system.clearRun(id);
                    return;
                } else if (current - now > maxTime) {
                    res(null);
                    system.clearRun(id);
                    return;
                }
                event.player.chestauraLastLostIndex = firstItem;
            });
        }).then((average) => {
            if (average === null) return;
            if (average < 150) {
                event.player.flag("ChestAura", "B", "Player (ChestStealer)", { average: average.toFixed(2), stackAmount });
            } else event.player.sendMessage("Time taken: " + average);
        })
    }
}

function stackInventoryItem (container: Container) {
    let unstackableAmount = 0;
    const stackable = {} as { [key: string]: number };
    for (let i = 0; i < container.size; i++) {
        const item = container.getItem(i);
        if (!item) continue;
        if (item.isStackable) {
            stackable[item.typeId] ??= 0;
            stackable[item.typeId]++;
            if (stackable[item.typeId] > item.maxAmount) {
                unstackableAmount++;
                stackable[item.typeId] = 1;
            }
        } else unstackableAmount++;
    }
    return unstackableAmount + Object.keys(stackable).length;
}