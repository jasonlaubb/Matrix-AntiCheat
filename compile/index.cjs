console.log("[Process] Start compiling");
const { spawn } = require('node:child_process');
const fs = require('fs');
function compile() {
	spawn("tsc", ["--build", "../tsconfig.json"]);
}
const text = Object.entries(require("../Matrix-Total/text.json"));
const translation = require("../Matrix-Total/translation.json");
const langList = require("../Matrix-Total/RP/texts/languages.json");
const finalTranslation = {};
for (const [key, value] of text) {
	const tran = translation[key];
	const newObject = {
		source: value,
		translation: {},
	};
	langList.forEach((v) => {
		newObject.translation[v] = tran ? tran.translation[v] ?? "" : "";
	});
	finalTranslation[key] = newObject;
}
fs.writeFileSync("../Matrix-Total/translation.json", JSON.stringify(finalTranslation, null, "	"));
console.log("[Text] Language file updated/checked.")
const createPath = "../Matrix-Total/RP/texts/";
for (const lang of langList) {
	const texts = [];
	const entry = Object.entries(finalTranslation);
	for (const [key, value] of entry) {
		const textString = value.translation[lang];
		const trueString = value.length > 0 ? textString : value.source;
		texts.push(`${key}=${trueString}`);
	}
	fs.writeFileSync(createPath + lang + ".lang", texts.join("\n"));
}
console.log("[Text] Language file generated.");
// Unfinished
console.log("[Process] Finish!");