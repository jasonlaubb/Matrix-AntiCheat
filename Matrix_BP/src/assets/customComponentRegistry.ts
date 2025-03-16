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
	init.itemComponentRegistry.registerCustomComponent("matrixui", new matrixui());
	init.itemComponentRegistry.registerCustomComponent("modPanel", new modPanel());
	// Pretender Blocks
	init.blockComponentRegistry.registerCustomComponent("stoneLoot", tile(MinecraftItemTypes.Stone, null, MinecraftItemTypes.Cobblestone, ["pickaxe"], null));
	init.blockComponentRegistry.registerCustomComponent("diamondLoot", tile(MinecraftItemTypes.DiamondOre, MinecraftItemTypes.DeepslateDiamondOre, MinecraftItemTypes.Diamond, ["iron_pickaxe", "diamond_pickaxe", "netherite_pickaxe"], [1, 1], 3, 7));
	init.blockComponentRegistry.registerCustomComponent("coalLoot", tile(MinecraftItemTypes.CoalOre, MinecraftItemTypes.DeepslateCoalOre, MinecraftItemTypes.Coal, ["pickaxe"], [1, 1], 0, 2));
})