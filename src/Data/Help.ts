import lang from "./Languages/lang";
import { keys } from "../Modules/Modules";
import { c } from "../Assets/Util";

export function toggleList(p: string): string {
    const config = c();
    return validModules.map((module) => `§l§7(${(config as any)[module].enabled ? "§aenabled" : "§cdisabled"}§7)§r §g${p}toggle ${module} <enable/disable> - ${lang("-toggles.toggle")} ${module} ${lang("-toggles.module")}`).join("\n");
}

export const validModules: string[] = ["chatRank", "dimensionLock", ...keys];
