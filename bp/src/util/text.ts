import english from "../data/languages/english";
import { get } from "./database";
let currentLanguage = english;
const languageList: { [key: string]: TranslationKey } = {
    english,
};
export function updateLanguage () {
      currentLanguage = languageList[get("systemLanguage")] ?? languageList.english;
}
export function text(key: keyof typeof english, ...args: string[]): string {
    let string = currentLanguage[key];
    if (args.length === 0) return string;
    args.forEach((arg, i) => {
        // Replace %s or %1 for first arg, %2 for second, etc.
        if (i === 0) {
            string = string.replace(/%s|%1/g, arg);
        } else {
            const placeholder = "%" + (i + 1);
            string = string.replaceAll(placeholder, arg);
        }
    });
    return string;
}
