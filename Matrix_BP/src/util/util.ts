import { MemoryTier, PlatformType, Player, system, Vector3 } from "@minecraft/server";
import { ActionFormData, ActionFormResponse, FormCancelationReason, ModalFormData, ModalFormResponse } from "@minecraft/server-ui";
/**
 *
 * @param memoryTier
 * @returns 3 = Not higher than 8GB
 */
export function returnTierNumber(memoryTier: MemoryTier) {
    switch (memoryTier) {
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
export function getBlockCenterLocation(blockLocation: Vector3) {
    const { x, y, z } = floorLocation(blockLocation);
    return { x: x + 0.5, y: y + 0.5, z: z + 0.5 };
}
export function floorLocation(location: Vector3) {
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
export function getValueFromObject(object: any, keys: string[]) {
    for (const key of keys) {
        object = object[key];
    }
    return object;
}
export function changeValueOfObject(object: any, keys: string[], value: any) {
    for (const key of keys.slice(0, keys.length - 1)) {
        object = object[key];
    }
    object[keys[keys.length - 1]] = value;
    return object;
}

export function waitShowModalForm(ui: ModalFormData, player: Player): Promise<ModalFormResponse | null> {
    return new Promise(async (resolve) => {
        do {
            if (!player?.isValid()) break;
            //@ts-expect-error
            const res = await ui.show(player);
            if (res.canceled) {
                if (res.cancelationReason! === FormCancelationReason.UserBusy) {
                    await system.waitTicks(20);
                } else {
                    break;
                }
            } else {
                resolve(res);
                return;
            }
        } while (true);
        resolve(null);
    });
}

export function waitShowActionForm(ui: ActionFormData, player: Player): Promise<ActionFormResponse | null> {
    return new Promise(async (resolve) => {
        do {
            if (!player?.isValid()) break;
            //@ts-expect-error
            const res = await ui.show(player);
            if (res.canceled) {
                if (res.cancelationReason! === FormCancelationReason.UserBusy) {
                    await system.waitTicks(20);
                } else {
                    break;
                }
            } else {
                resolve(res);
                return;
            }
        } while (true);
        resolve(null);
    });
}
