import { BlockComponentPlayerDestroyEvent, BlockCustomComponent, ItemStack } from "@minecraft/server";
import { noDrop, randomInt, spawnExpOrbs, vanillaAny, weightRandom } from "./util";
import { MinecraftEnchantmentTypes } from "../node_modules/@minecraft/vanilla-data/lib/index";
/**
 * @author jasonlaubb
 * @description Create custom ore drops
 */
export default function tileBuilder (silkTile: string, deepTile: string | null, dropItem: string, allowTool: string[], baseRange: null | [number, number], minOrbs: number = 0, maxOrbs: number = 0) {
	class OreTile implements BlockCustomComponent {
		constructor () {
			this.onPlayerDestroy = this.onPlayerDestroy.bind(this);
		}
		onPlayerDestroy ({ player, block: { location, dimension }, destroyedBlockPermutation: { type: { id }} }: BlockComponentPlayerDestroyEvent) {
			// Skip if doTileDrop is false
			if (noDrop()) return;
			// Get the tool that player use
			const item = player?.getHeldItem();
			// Get the fortune level of the tool
			const level = (item?.getEnchantLevel(MinecraftEnchantmentTypes.Fortune) ?? 0);
			if (player) {
				// Don't drop the item if player doesn't hold the suitable tool
				if (!item || !vanillaAny(item.typeId, ...allowTool)) return;
				// Spawn the exp orbs
				if (maxOrbs > 0) spawnExpOrbs(dimension, location, randomInt(minOrbs, maxOrbs), level);
			}
			// Drop original block if the tool has silk touch
			if (item && item.getEnchantLevel(MinecraftEnchantmentTypes.SilkTouch) > 0) {
				if (deepTile && id.includes("deepslate"))
					dimension.spawnItem(new ItemStack(deepTile, 1), location);
				else;
					dimension.spawnItem(new ItemStack(silkTile, 1), location);
			} else {
				// Drop the raw ore
				if (baseRange) {
					dimension.spawnItem(new ItemStack(dropItem, tileMultiplier(level, baseRange)), location);
				} else {
					dimension.spawnItem(new ItemStack(dropItem, 1), location);
				}
			}
		}
	}
	return new OreTile();
}
function tileMultiplier (fortune: number = 0, baseRange: [number, number]) {
	if (fortune === 0) return 1;
	const [min, max] = baseRange;
	const weightList: [number, number][] = [[randomInt(min, max), 2]];
	for (let i = 0; i < fortune; i++) {
		const level = i + 1;
		weightList.push([randomInt(min * level, max * level), 1]);
	}
	return weightRandom(...weightList);
}
