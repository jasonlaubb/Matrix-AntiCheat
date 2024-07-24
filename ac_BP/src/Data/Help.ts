import { getModulesIds } from "../Modules/Modules";
import { c, rawstr } from "../Assets/Util";

export async function toggleList(p: string): Promise<rawstr> {
    const config = c();
    const validModules: string[] = await getModulesIds();
    return rawstr.compare(
        ...validModules.map((module) =>
            new rawstr()
                .str(`\n§l§7(${(config as any)[module]?.enabled ? "§aenabled" : "§cdisabled"}§7)§r §g${p}toggle ${module} <enable/disable> - `)
                .tra("toggles.toggle", module)
        )
    );
}