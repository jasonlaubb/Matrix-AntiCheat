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
    if (event.block.typeId !== "minecraft:chest" || distanceXZ(event.player.location, event.block.location) < 2) return;
    const angle = calculateRelativeViewAngle(event.player.location, event.block.center(), event.player.getRotation().y);
    system.run(() => event.player.sendMessage(angle.toString()));
    if (angle > (event.player.inputInfo.lastInputModeUsed === "Touch" ? 120 : 30)) {
        event.cancel = true;
        system.run(() => event.player.flag("ChestAura", "A", "Player", { angle: angle.toFixed(2) }));
        return;
    }
    const container = event.block.getComponent("inventory")!.container!;
    const containerFirstItem = container.firstItem();
    if (containerFirstItem !== undefined) {
        const itemAmount = stackInventoryItem(container);
        system.run(() => event.player.sendMessage("StartChecking... Weight: " + itemAmount));
        const now = Date.now();
        event.player.chestauraLastLostIndex = containerFirstItem;
        new Promise<number>((res) => {
            const id = system.runInterval(() => {
                const firstItem = container.firstItem();
                if (firstItem === undefined) {
                    res((Date.now() - now) / itemAmount);
                    system.clearRun(id);
                    return;
                }
                event.player.chestauraLastLostIndex = firstItem;
            });
        }).then((v) => {
            if (v !== null) {
                event.player.sendMessage("Time: " + v);
            } else {
                event.player.sendMessage("Not hacker");
            }
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