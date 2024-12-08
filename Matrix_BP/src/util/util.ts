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
    try {
        for (const key of keys) {
            object = object[key];
        }
    } catch {
        return undefined;
    }
    return object;
}
export function changeValueOfObject(object: any, keys: string[], value: any) {
    switch (keys.length) {
        case 1:
            object[keys[0]] = value;
            return object;
        case 2:
            object[keys[0]][keys[1]] = value;
            return object;
        case 3:
            object[keys[0]][keys[1]][keys[2]] = value;
            return object;
        case 4:
            object[keys[0]][keys[1]][keys[2]][keys[3]] = value;
            return object;
        case 5:
            object[keys[0]][keys[1]][keys[2]][keys[3]][keys[4]] = value;
            return object;
        default:
            throw new Error("Too many keys!!!!");
    }
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
