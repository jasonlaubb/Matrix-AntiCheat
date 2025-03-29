import itemcheck from "./itemcheck";
import { Module } from "../../matrixAPI";
import { GameMode, rawtextTranslate, world, PlayerPlaceBlockAfterEvent } from "../../util/rawtext";

const placeCheck = new Module()
    .setTag(I forgot)
    .setName(rawtextTranslate("module.placecheck.name"))
    .setDescription(rawtextTranslate("module.placecheck.description"))
    .onModuleEnable(() => {
        world.afterEvents.playerPlaceBlock.subscribe(onPlace);
    })
    .onModuleDisable(() => {
        world.afterEvents.playerPlaceBlock.subscribe(onPlace);
    });
placeCheck.register();

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
                player.flag(placeCheck, { t: 3 });
            }
        }, 1);
                                           }
    }
}
