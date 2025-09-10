import english from "../data/language/english";
let currentLanguage: typeof english;
const languageList: { [key: string]: typeof english } = {
    english,
};
function updateLanguage () {
      currentLanguage = languageList[get("systemLanguage")] ?? languageList.english;
}
function text (key: keyof typeof english, ...args: string[]): string {
      let string = currentLanguage[key];
      const length = args.length;
      if (length === 0) return;
      for (let i = 0, i < length; i++) {
          const arg = args[i];
          if (i === 0) {
              string = string.replace(/%s|%1/g, arg);
              continue;
          }
          string = string.replaceAll("%" + i);
      }
      return string;
}
