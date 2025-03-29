import itemcheck from "./itemcheck";
import { Module } from "../../matrixAPI";
import { GPlayerInteractWithBlockAfterEvent, GameMode, rawtextTranslate, world, PlayerPlaceBlockAfterEvent, PlayerPlaceBlockBeforeEvent } from "../../util/rawtext";
import { MinecraftBlockTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
const placeCheck = new Module()
    .setTag(4)
    .setName(rawtextTranslate("module.placecheck.name"))
    .setDescription(rawtextTranslate("module.placecheck.description"))
    .onModuleEnable(() => {
        world.afterEvents.playerPlaceBlock.subscribe(onPlace);
        world.beforeEvents.playerPlaceBlock.subscribe(beforePlace);
    })
    .onModuleDisable(() => {
        world.afterEvents.playerPlaceBlock.unsubscribe(onPlace);
        world.beforeEvents.playerPlaceBlock.unsubscribe(onPlace);
    });
placeCheck.register();
const CBE_ITEMS = [MinecraftBlockTypes.Beehive, MinecraftBlockTypes.BeeNest];
function beforePlace(event: PlayerPlaceBlockBeforeEvent) {
    const config = Module.config.sensitivity.placeCheck;
    if (config.blockCommandBlockExploit && event.block.typeId.startsWith("minecraft:bee")) {
        event.cancel = true;
        player.flag(placeCheck, { t: 3 });
    } else if (config.blockMovingBlock && event.block.typeId === "minecraft:moving_block") {
        event.cancel = true;
        player.flag(placeCheck, { t: 4 });world.afterEvents.playerPlaceBlock.subscribe(onPlace);
    }
}
function onPlace({ player, block }: PlayerPlaceBlockAfterEvent) {
    if (player.isAdmin() || block.isAir || !block.isValid) return;
    const container = block.getComponent("container")?.container;
    if (container) {
        let isFlagged = false;
        for (let i = 0; i < container.size; i++) {
            const item = container.getItem(i);
            if (!item) continue;
            const result = itemcheck(item);
            if (result) {
                if (!isFlagged) {
                    result.t! = "1-" + result.t;
                    player.flag(placeCheck, result as any);
                    isFlagged = true;
                }
                container.setItem(i);
            }
        }
    } else {
        if (block.typeId.endsWith("sign")) {system.runTimeout(() => {
            const sign = block.getComponent("sign");
            if (!sign) return;
            if (sign.getText() || sign.getRawText()) {
                block.setType("air");
                player.flag(placeCheck, { t: 2 });
            }
        }, 1);
                                           }
    }
}
