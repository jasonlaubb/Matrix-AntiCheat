import { getModulesIds } from "../Modules/Modules";
import { c, rawstr } from "../Assets/Util";

export function toggleList(p: string): rawstr {
    const config = c();
    return rawstr.compare(
        ...validModules.map((module) =>
            new rawstr()
                .str(`§l§7(${(config as any)[module].enabled ? "§aenabled" : "§cdisabled"}§7)§r §g${p}toggle ${module} <enable/disable> - `)
                .tra("toggles.toggle", module)
                .str("\n")
        )
    );
}

export const validModules: string[] = ["chatRank", "dimensionLock", ...getModulesIds()];
