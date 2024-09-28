import { Player, RawText } from "@minecraft/server";
import { c, isAdmin, rawstr, Type } from "./Util";
interface Modules {
    referencedFlags: number,
    maxFlags: number,
    instantPunishment: boolean,
    acceptTotal: boolean,
    flagValidationTime: number,
    bestPunishment: string,
}
interface FlagData {
    sus: number,
    flagComponent: string[],
    flagVL: { [key: string]: number },
}
const flagData = new Map<string, FlagData>()
export function flag(player: Player, type: Type, modules: Modules) {
    if (!(player instanceof Player) || isAdmin(player)) return;
    const config = c();
    const data = flagData.get(player.id) ?? {
        sus: 0,
        flagComponent: [],
        flagVL: {},
    } as FlagData;
    if (modules.instantPunishment) {

    }
    if (modules.acceptTotal) {
        data.sus += (1 / modules.referencedFlags);
    }
}
function sendFlagMessage (object: string, type: string, component: string[], slove: string): RawText {
    return new rawstr().tra("object.detected", object, type, "string", slove).parse();
}