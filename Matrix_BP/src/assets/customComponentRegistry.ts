import { ItemComponentHitEntityEvent, ItemComponentUseEvent, ItemCustomComponent, Player, system, RawText } from "@minecraft/server";
import { MinecraftItemTypes } from "../node_modules/@minecraft/vanilla-data/lib/index";
import { ModPanel } from "../util/modPanel";
import tile from "../util/tileBuilder";
class matrixui implements ItemCustomComponent {
    constructor() {
        this.onUse = this.onUse.bind(this);
    }
    onUse({ source }: ItemComponentUseEvent) {
        source.runChatCommand("matrixui");
    }
}
class modPanel implements ItemCustomComponent {
    constructor() {
        this.onUse = this.onUse.bind(this);
    }
    onUse({ source }: ItemComponentUseEvent) {
        if (!source.isAdmin()) return;
        ModPanel.open(source);
    }
    onHitEntity({ hitEntity, attackingEntity }: ItemComponentHitEntityEvent) {
        if (hitEntity instanceof Player && attackingEntity instanceof Player && attackingEntity.isAdmin()) ModPanel.open(attackingEntity, hitEntity);
    }
}
// Register the custom components
system.beforeEvents.startup.subscribe((init) => {
    // Matrix Items
    init.itemComponentRegistry.registerCustomComponent("matrix:matrixui", new matrixui());
    init.itemComponentRegistry.registerCustomComponent("matrix:modPanel", new modPanel());
    // Pretender Blocks
    init.blockComponentRegistry.registerCustomComponent("matrix:stoneLoot", tile(MinecraftItemTypes.Cobblestone, 0, null));
    init.blockComponentRegistry.registerCustomComponent("matrix:diamondLoot", tile(MinecraftItemTypes.Diamond, 2, [1, 1], 3, 7));
    init.blockComponentRegistry.registerCustomComponent("matrix:coalLoot", tile(MinecraftItemTypes.Coal, 0, [1, 1], 0, 2));
    init.blockComponentRegistry.registerCustomComponent("matrix:ironLoot", tile(MinecraftItemTypes.RawIron, 1, [1, 1]));
    init.blockComponentRegistry.registerCustomComponent("matrix:goldLoot", tile(MinecraftItemTypes.RawGold, 2, [1, 1]));
    init.blockComponentRegistry.registerCustomComponent("matrix:redstoneLoot", tile(MinecraftItemTypes.Redstone, 2, [1, 5], 1, 5, true));
    init.blockComponentRegistry.registerCustomComponent("matrix:emeraldLoot", tile(MinecraftItemTypes.Emerald, 2, [1, 1], 3, 7));
    init.blockComponentRegistry.registerCustomComponent("matrix:lapisLoot", tile(MinecraftItemTypes.LapisLazuli, 1, [1, 1], 2, 5));
    init.blockComponentRegistry.registerCustomComponent("matrix:netheriteLoot", tile(MinecraftItemTypes.AncientDebris, 3, null));
    init.blockComponentRegistry.registerCustomComponent("matrix:netherrackLoot", tile(MinecraftItemTypes.Netherrack, 0, null));
    init.blockComponentRegistry.registerCustomComponent("matrix:goldNuggetLoot", tile(MinecraftItemTypes.GoldNugget, 0, [2, 6], 0, 1));
    init.blockComponentRegistry.registerCustomComponent("matrix:quartzLoot", tile(MinecraftItemTypes.Quartz, 0, [1, 1], 2, 5));
    init.blockComponentRegistry.registerCustomComponent("matrix:deepslateLoot", tile(MinecraftItemTypes.CobbledDeepslate, 0, null));
    init.blockComponentRegistry.registerCustomComponent("matrix:copperLoot", tile(MinecraftItemTypes.RawCopper, 0, [2, 5]));
});
export class Command {
    public static commands: Command[] = [];
    public static create (commandOption: (cmd: Command) => Command) {
        const commandBuild = commandOption(new Command());
        commands.push(commands);
    }
    public name: RawText = { text: "" };
    public description: RawText = { text: "" };
    public execute: (...args: any[]) => void = () => {};
}
