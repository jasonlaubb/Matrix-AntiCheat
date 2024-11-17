import { MemoryTier, PlatformType, Vector3 } from "@minecraft/server";
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
export function getBlockCenterLocation (blockLocation: Vector3) {
	const { x, y, z } = floorLocation(blockLocation);
	return { x: x + 0.5, y: y + 0.5, z: z + 0.5 };
}
export function floorLocation (location: Vector3) {
	return { x: Math.floor(location.x), y: Math.floor(location.y), z: Math.floor(location.z) };
}
const KILLAURA_MOBILE_ANGLE_LIMIT = 120;
const KILLAURA_DESKTOP_ANGLE_LIMIT = 45;
const KILLAURA_CONSOLE_ANGLE_LIMIT = 40;
export function getAngleLimit(platformType: PlatformType): number {
    switch (platformType) {
        case PlatformType.Mobile:
            return KILLAURA_MOBILE_ANGLE_LIMIT;
        case PlatformType.Desktop:
            return KILLAURA_DESKTOP_ANGLE_LIMIT;
        case PlatformType.Console:
            return KILLAURA_CONSOLE_ANGLE_LIMIT;
    }
}