import { BlockComponentPlayerDestroyEvent, BlockCustomComponent, ItemComponentHitEntityEvent, ItemComponentUseEvent, ItemCustomComponent, ItemStack, Player, world } from "@minecraft/server";
import { noDrop, randomInt, spawnExpOrbs, vanillaAny, weightRandom } from "../util/util";
import { MinecraftEnchantmentTypes, MinecraftItemTypes } from "../node_modules/@minecraft/vanilla-data/lib/index";
import { ModPanel } from "../util/modPanel";
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
class stoneLoot implements BlockCustomComponent {
	constructor () {
		this.onPlayerDestroy = this.onPlayerDestroy.bind(this);
	}
	onPlayerDestroy ({ player, block: { location, dimension } }: BlockComponentPlayerDestroyEvent) {
		const item = player?.getHeldItem();
		if (player)
			if (!item || !vanillaAny(item.typeId, "pickaxe")) return;
		if (item && item.getEnchantLevel(MinecraftEnchantmentTypes.SilkTouch) > 0)
			dimension.spawnItem(new ItemStack(MinecraftItemTypes.Stone, 1), location);
		else;
			dimension.spawnItem(new ItemStack(MinecraftItemTypes.Cobblestone, 1), location);
	}
}
class diamondLoot implements BlockCustomComponent {
	constructor () {
		this.onPlayerDestroy = this.onPlayerDestroy.bind(this);
	}
	onPlayerDestroy ({ player, block: { location, dimension }, destroyedBlockPermutation: { type: { id }} }: BlockComponentPlayerDestroyEvent) {
		if (noDrop()) return;
		const item = player?.getHeldItem();
		const level = (item?.getEnchantLevel(MinecraftEnchantmentTypes.Fortune) ?? 0) + 1;
		if (player) {
			if (!item || !vanillaAny(item.typeId, "iron_pickaxe", "diamond_pickaxe", "netherite_pickaxe")) return;
			spawnExpOrbs(dimension, location, randomInt(3, 7), level);
		}
		if (item && item.getEnchantLevel(MinecraftEnchantmentTypes.SilkTouch) > 0) {
			if (id.includes("deepslate"))
				dimension.spawnItem(new ItemStack(MinecraftItemTypes.DeepslateDiamondOre, 1), location);
			else;
				dimension.spawnItem(new ItemStack(MinecraftItemTypes.DiamondOre, 1), location);
		} else {
			dimension.spawnItem(new ItemStack(MinecraftItemTypes.Diamond, diamondDrop(level)), location);
		}
	}
}
function diamondDrop (fortune: number = 0) {
	const weightList: [number, number][] = [[1, 2]];
	for (let i = 0; i < fortune; i++) {
		weightList.push([fortune + 1, 2]);
	}
	return weightRandom(...weightList);
}
// Register the custom components
world.beforeEvents.worldInitialize.subscribe((init) => {
	// Matrix Items
	init.itemComponentRegistry.registerCustomComponent("matrixui", new matrixui());
	init.itemComponentRegistry.registerCustomComponent("modPanel", new modPanel());
	// Pretender Blocks
	init.blockComponentRegistry.registerCustomComponent("stoneLoot", new stoneLoot());
	init.blockComponentRegistry.registerCustomComponent("diamondLoot", new diamondLoot());
})