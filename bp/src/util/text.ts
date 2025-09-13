import { Player } from "@minecraft/server";
import chinese_simplifed from "../data/languages/chinese_simplifed";
import chinese_traditional from "../data/languages/chinese_traditional";
import english from "../data/languages/english";
import { get } from "./database";
import { ActionFormData } from "@minecraft/server-ui";
import french from "../data/languages/french";
export type TranslationKey = keyof typeof english;
let currentLanguage = english;
export const languageList = {
    english,
    chinese_simplifed,
    chinese_traditional,
    french,
};
export function updateLanguage() {
    currentLanguage = languageList[get("systemLanguage") as keyof typeof languageList] ?? languageList.english;
}
export function text(key: TranslationKey, ...args: (string | number)[]): string {
    let string = currentLanguage[key];
    if (args.length === 0) return string;
    args.forEach((arg, i) => {
        // Replace %s or %1 for first arg, %2 for second, etc.
        if (i === 0) {
            string = string.replace(/%s|%1/g, String(arg));
        } else {
            const placeholder = "%" + (i + 1);
            string = string.replaceAll(placeholder, String(arg));
        }
    });
    return string;
}
export async function languageSelectUI(player: Player) {
    const res = await new ActionFormData()
        .title("Select your language / 请选择你的语言")
        .button("English")
        .button("中文 (繁體)")
        .button("中文 (简体)")
        .button("Français")
        //@ts-expect-error
        .show(player);
    if (res.canceled) return false;
    const languages: (keyof typeof languageList)[] = ["english", "chinese_traditional", "chinese_simplifed", "french"];
    player.lastRunUICommand = true;
    player.runCommand(`matrix:language ${languages[res.selection!]}`);
    return true;
}
