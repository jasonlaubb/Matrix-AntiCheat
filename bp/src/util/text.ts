import english from "../data/language/english";
let currentLanguage: typeof english;
const languageList: { [key: string]: typeof english } = {
    english,
};
function updateLanguage () {
      currentLanguage = languageList[get("systemLanguage")] ?? languageList.english;
}
function text () {
      return currentLanguage;
}
