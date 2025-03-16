import { ItemComponentHitEntityEvent, ItemComponentUseEvent, ItemCustomComponent, Player, world } from "@minecraft/server";
import { MinecraftItemTypes } from "../node_modules/@minecraft/vanilla-data/lib/index";
import { ModPanel } from "../util/modPanel";
import tile from "../util/tileBuilder";
class matrixui implements ItemCustomComponent {
	constructor () {
		this.onUse = this.onUse.bind(this);
	}
	onUse ({ source }: ItemComponentUseEvent) {
		source.runChatCommand("matrixui");
	}
}
class modPanel implements ItemCustomComponent {
	constructor () {
		this.onUse = this.onUse.bind(this);
	}
	onUse ({ source }: ItemComponentUseEvent) {
		if (!source.isAdmin()) return;
		ModPanel.open(source);
	}
	onHitEntity ({ hitEntity, attackingEntity }: ItemComponentHitEntityEvent) {
		if (hitEntity instanceof Player && attackingEntity instanceof Player && attackingEntity.isAdmin())
			ModPanel.open(attackingEntity, hitEntity);
	}
}
// Register the custom components
world.beforeEvents.worldInitialize.subscribe((init) => {
	// Matrix Items
	init.itemComponentRegistry.registerCustomComponent("matrix:matrixui", new matrixui());
	init.itemComponentRegistry.registerCustomComponent("matrix:modPanel", new modPanel());
	// Pretender Blocks
	init.blockComponentRegistry.registerCustomComponent("matrix:stoneLoot", tile(MinecraftItemTypes.Stone, null, MinecraftItemTypes.Cobblestone, ["pickaxe"], null));
	init.blockComponentRegistry.registerCustomComponent("matrix:diamondLoot", tile(MinecraftItemTypes.DiamondOre, MinecraftItemTypes.DeepslateDiamondOre, MinecraftItemTypes.Diamond, ["iron_pickaxe", "diamond_pickaxe", "netherite_pickaxe"], [1, 1], 3, 7));
	init.blockComponentRegistry.registerCustomComponent("matrix:coalLoot", tile(MinecraftItemTypes.CoalOre, MinecraftItemTypes.DeepslateCoalOre, MinecraftItemTypes.Coal, ["pickaxe"], [1, 1], 0, 2));
	init.blockComponentRegistry.registerCustomComponent("matrix:ironLoot", tile(MinecraftItemTypes.IronOre, MinecraftItemTypes.DeepslateIronOre, MinecraftItemTypes.RawIron, ["stone_pickaxe", "iron_pickaxe", "diamond_pickaxe", "netherite_pickaxe"], [1, 1]));
	init.blockComponentRegistry.registerCustomComponent("matrix:goldLoot", tile(MinecraftItemTypes.GoldOre, MinecraftItemTypes.DeepslateGoldOre, MinecraftItemTypes.RawGold, ["iron_pickaxe", "diamond_pickaxe", "netherite_pickaxe"], [1, 1]));
	init.blockComponentRegistry.registerCustomComponent("matrix:redstoneLoot", tile(MinecraftItemTypes.RedstoneOre, MinecraftItemTypes.DeepslateRedstoneOre, MinecraftItemTypes.Redstone, ["iron_pickaxe", "diamond_pickaxe", "netherite_pickaxe"], [1, 5], 1, 5, true));
	init.blockComponentRegistry.registerCustomComponent("matrix:emeraldLoot", tile(MinecraftItemTypes.EmeraldOre, MinecraftItemTypes.DeepslateEmeraldOre, MinecraftItemTypes.Emerald, ["iron_pickaxe", "diamond_pickaxe", "netherite_pickaxe"], [1, 1], 3, 7));
	init.blockComponentRegistry.registerCustomComponent("matrix:lapisLoot", tile(MinecraftItemTypes.LapisOre, MinecraftItemTypes.DeepslateLapisOre, MinecraftItemTypes.LapisLazuli, ["stone_pickaxe", "iron_pickaxe", "diamond_pickaxe", "netherite_pickaxe"], [1, 1], 2, 5));
	init.blockComponentRegistry.registerCustomComponent("matrix:netheriteLoot", tile(MinecraftItemTypes.AncientDebris, null, MinecraftItemTypes.AncientDebris, ["diamond_pickaxe", "netherite_pickaxe"], null));
	init.blockComponentRegistry.registerCustomComponent("matrix:netherrackLoot", tile(MinecraftItemTypes.Netherrack, null, MinecraftItemTypes.Netherrack, ["pickaxe"], null));
	init.blockComponentRegistry.registerCustomComponent("matrix:goldNuggetLoot", tile(MinecraftItemTypes.NetherGoldOre, null, MinecraftItemTypes.GoldNugget, ["pickaxe"], [2, 6], 0, 1));
	init.blockComponentRegistry.registerCustomComponent("matrix:quartzLoot", tile(MinecraftItemTypes.QuartzOre, null, MinecraftItemTypes.Quartz, ["pickaxe"], [1, 1], 2, 5));
})