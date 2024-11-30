import { ItemStack } from "@minecraft/server";
import { MinecraftItemTypes } from "../node_modules/@minecraft/vanilla-data/lib/index";
// Create the set of legal item
const legit = new Set(Object.values(MinecraftItemTypes) as string[]);
/**
 * @author jasonlaubb
 * @description Very simple item check (lol), idk why there is someone needing this.
 */
export function isItemIllegal (item: ItemStack) {
	const itemID = item.typeId;
	return legit.has(itemID) && item.amount <= item.maxAmount && item.amount >= 0 && (item.nameTag?.length ?? 0) <= 256 && item.getLore().length == 0 && isLegalEnchantment(item);
}
function isLegalEnchantment (item: ItemStack) {
	const enchantmentComponent = item.getComponent("enchantable");
	if (!enchantmentComponent) return true;
	const enchantments = enchantmentComponent.getEnchantments();
	if (enchantments.length == 0) return true;
	const illegalEnchantLevel = enchantments.some((enchantment) => {
		return enchantment.level > enchantment.type.maxLevel || enchantment.level <= 0;
	});
	const isRepeated = enchantments.length > (new Set(enchantments)).size;
	let cannotBeAdded = false;
	if (!illegalEnchantLevel && !isRepeated) {
		const cloneItem = item.clone();
		const cloneEnchantmentComponent = cloneItem.getComponent("enchantable");
		if (!cloneEnchantmentComponent) return false;
		cloneEnchantmentComponent.removeAllEnchantments();
		cannotBeAdded = enchantments.some((enchantment) => {
			const canAddEnchantment = cloneEnchantmentComponent.canAddEnchantment(enchantment);
			if (!canAddEnchantment) return true;
			cloneEnchantmentComponent.addEnchantment(enchantment);
			return false;
		})
	}
	return illegalEnchantLevel || isRepeated || cannotBeAdded;
}