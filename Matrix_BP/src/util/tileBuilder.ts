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
			if (noDrop()) return;
			const item = player?.getHeldItem();
			const level = (item?.getEnchantLevel(MinecraftEnchantmentTypes.Fortune) ?? 0) + 1;
			if (player) {
				if (!item || !vanillaAny(item.typeId, ...allowTool)) return;
				if (maxOrbs > 0) spawnExpOrbs(dimension, location, randomInt(minOrbs, maxOrbs), level);
			}
			if (item && item.getEnchantLevel(MinecraftEnchantmentTypes.SilkTouch) > 0) {
				if (deepTile && id.includes("deepslate"))
					dimension.spawnItem(new ItemStack(deepTile, 1), location);
				else;
					dimension.spawnItem(new ItemStack(silkTile, 1), location);
			} else {
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
