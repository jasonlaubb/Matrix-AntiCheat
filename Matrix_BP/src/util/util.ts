import { MemoryTier } from "@minecraft/server";
/**
 * 
 * @param memoryTier 
 * @returns 3 = Not higher than 8GB
 */
export function returnTierNumber (memoryTier: MemoryTier) {
	switch (memoryTier) {
		case MemoryTier.Undetermined:
			return -1;
		case MemoryTier.SuperLow:
			return 0;
		case MemoryTier.Low:
			return 1;
		case MemoryTier.Mid:
			return 2;
		case MemoryTier.High: // 8 GB phone >:D
			return 3;
		case MemoryTier.SuperHigh:
			return 4;
		default:
			return 0;
	}
}