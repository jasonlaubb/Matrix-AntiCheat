import { Block, Container, InvalidContainerError, PlayerInteractWithBlockBeforeEvent, system, world } from "@minecraft/server";
import { calculateRelativeViewAngle, distanceXZ } from "../util/mathUtil";
export default {
    enable() {
        world.beforeEvents.playerInteractWithBlock.subscribe(interact);
    },
    disable() {
        world.beforeEvents.playerInteractWithBlock.unsubscribe(interact);
    },
    property: "antiChestauraEnable",
};
let checkingBlocks = {} as { [key: string]: string };
function stringId(block: Block) {
    return Object.values(block.location).join(",");
}
function interact(event: PlayerInteractWithBlockBeforeEvent) {
    const inventory = event.block.getComponent("inventory");
    if (!inventory || (inventory.container?.size ?? 0) < 27 || event.player.isOp() || distanceXZ(event.player.location, event.block.location) < 2) return;
    const angle = calculateRelativeViewAngle(event.player.location, event.block.center(), event.player.getRotation().y);
    if (angle > (event.player.inputInfo.lastInputModeUsed === "Touch" ? 120 : 30)) {
        event.cancel = true;
        system.run(() => event.player.flag("ChestAura", "A", "Player", { angle: angle.toFixed(2) }));
        return;
    }
    const container = inventory.container!;
    const containerFirstItem = container.firstItem();
    const blockId = stringId(event.block);
    if (checkingBlocks[blockId]) {
        checkingBlocks[blockId] = event.player.id;
        return;
    }
    if (containerFirstItem !== undefined) {
        const stackAmount = stackInventoryItem(container);
        const now = Date.now();
        event.player.chestauraLastLostIndex = containerFirstItem;
        checkingBlocks[blockId] = event.player.id;
        const maxTime = stackAmount * 200;
        new Promise<number | null>((res) => {
            const id = system.runInterval(() => {
                try {
                    if (!event.player?.isValid && checkingBlocks[blockId] !== event.player.id || !event.block.isValid || event.block.isAir) {
                        system.clearRun(id);
                        res(null);
                        return;
                    }
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
                } catch (error) {
                    res(null);
                    system.clearRun(id);
                    if (error instanceof InvalidContainerError) return;
                    throw error;
                }
            });
        })
            .then((average) => {
                if (average === null) return;
                if (average < 120) {
                    event.player.flag("ChestAura", "B", "Player (ChestStealer)", { average: average.toFixed(2), stackAmount });
                }
            })
            .finally(() => {
                delete checkingBlocks[blockId];
            });
    }
}

function stackInventoryItem(container: Container) {
    let unstackableAmount = 0;
    const stackable = {} as { [key: string]: number };
    for (let i = 0; i < container.size; i++) {
        const item = container.getItem(i);
        if (!item) continue;
        if (item.maxAmount > 1) {
            stackable[item.typeId] ??= 0;
            stackable[item.typeId] += item.amount;
            if (stackable[item.typeId] > item.maxAmount) {
                unstackableAmount++;
                stackable[item.typeId] -= item.maxAmount;
            }
        } else unstackableAmount++;
    }
    return unstackableAmount + Object.keys(stackable).length;
}
