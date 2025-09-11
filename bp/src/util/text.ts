import english from "../data/languages/english";
import { get } from "./database";
export type TranslationKey = keyof typeof english;
let currentLanguage = english;
export const languageList: { [key: string]: typeof english } = {
    english,
};
export function updateLanguage () {
      currentLanguage = languageList[get("systemLanguage")] ?? languageList.english;
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
