const validLanguage = [
    "bg_BG",
    "cs_CZ",
    "da_DK",
    "de_DE",
    "el_GR",
    "en_GB",
    "en_US",
    "es_ES",
    "es_MX",
    "fi_FI",
    "fr_CA",
    "fr_FR",
    "hu_HU",
    "id_ID",
    "it_IT",
    "ja_JP",
    "ko_KR",
    "nb_NO",
    "nl_NL",
    "pl_PL",
    "pt_BR",
    "pt_PT",
    "ru_RU",
    "sk_SK",
    "sv_SE",
    "tr_TR",
    "uk_UA",
    "zh_CN",
    "zh_TW",
];
const fixedStart = `"Language: N/A\\n"
"MIME-Version: 1.0\\n"
"Content-Type: text/plain; charset=UTF-8\\n"
"Content-Transfer-Encoding: 8bit\\n"
"Plural-Forms: nplurals=2; plural=(n != 1);\\n"
"X-Generator: PhraseApp (phraseapp.com)\\n"`;
const doTranslate = false;
import("fs").then((fsModule) => {
    import("path").then((pathModule) => {
        const fs = fsModule.default;
        const path = pathModule.default;
        const checkRoot = fs.existsSync("./texts");
        const root = checkRoot ? "./texts/" : "./";

        async function convertPotFilesToPo() {
            console.log("Process: Preparing to convert pot files to po files");
            const { po } = await import("gettext-parser");
            if (doTranslate) {
                const poContent = fs.readFileSync(root + "pot/en_US.pot", "utf8");
                const output = poContent.split("\n").filter((a) => a.startsWith("#: ")).map((a) => a.slice(3)).map((v) => '    | "' + v.replace("\r", "") + '"')
                const filed = fs.readFileSync(root == "./" ? "../src/Assets/Language.ts" : "./src/Assets/Language.ts", "utf8");
                const lines = filed.split("export");
                let there = lines[0] + "export type Translate = \n";
                there += output.join("\n");

                fs.writeFileSync(root == "./" ? "../src/Assets/Language.ts" : "./src/Assets/Language.ts", there);
                return;
            };
            fs.readdir(root + "pot", async (err, files) => {
                if (err) {
                    await new Promise((resolve) => setTimeout(resolve, 500));
                    console.error(err);
                    return;
                }

                const copyFiles = fs.readFileSync(root + "pot/en_US.pot", "utf8");

                if (files.length < validLanguage.length) {
                    const notAdded = validLanguage.filter((x) => !files.includes(x + ".pot"));
                    notAdded.forEach((file) => {
                        fs.writeFileSync(root + "pot/" + file + ".pot", copyFiles);
                    });
                    console.log("Missing .pot files");
                    await new Promise((resolve) => setTimeout(resolve, 500));
                    convertPotFilesToPo();
                    return;
                }
                console.log("Process: Start reading pot files");
                const enusBase = fs.readFileSync(root + "pot/en_US.pot", "utf8").replace(/\r/g, "").split("\n").map((a) => a.trim()).join("\n");
                const acceptedStr = enusBase.match(/#\: .*/g).map((a) => a.slice(3));
                const valueCatch = enusBase.match(/msgid ".*"/g).map((a) => a.slice(7).slice(0,-1));
                const biu = [];
                for (let i = 0; i < acceptedStr.length; i++) {
                    biu.push([acceptedStr[i], valueCatch[i]]);
                }
                files.forEach(async (file) => {
                    if (file.endsWith(".pot")) {
                        const potFilePath = path.join(root + "pot", file);
                        let potContent = fs.readFileSync(potFilePath, "utf8");
                        const crpotContent = potContent.replace(/\r/g, "").split("\n").map((a) => a.trim()).join("\n");

                        let lines = potContent.split("\n").filter((a) => !a.startsWith("#") || a.startsWith("#:"));
                        let updatedContent = "";

                        const properties = crpotContent.match(/#\: .*/g).map((a) => a.slice(3));
                        //const property = crpotContent.match(/msgid ".*"/g).map((a) => a.slice(7).slice(0,-1));
                        const kakaka = crpotContent.match(/msgstr ".*"/g).map((a) => a.slice(7).slice(0,-1).replace(/"/g, ""));
                        let potUpdateFile = fixedStart;
                        let hasChanged = false;
                        for (let i = 0; i < biu.length; i++) {
                            const [lore, msgid] = biu[i];
                            const index = properties.includes(lore);
                            if (index) {
                                const actindex = properties.indexOf(lore);
                                potUpdateFile += `
                                #: ${lore}
                                msgid "${msgid.replace("\r", "")}"
                                msgstr "${kakaka[actindex].replace("\r", "")}"
                                `;
                            } else {
                                potUpdateFile += `
                                #: ${lore}
                                msgid "${msgid.replace("\r", "")}"
                                msgstr ""
                                `;
                                hasChanged = true;
                                console.log("Warning: Missing property or other language: " + lore.replace(/\n|\r/g, ""));
                            }
                        }
                        
                        if (hasChanged || properties.length > biu.length) {
                            potUpdateFile = potUpdateFile.split("\n").map((a) => a.trim()).join("\n");
                            fs.writeFileSync(potFilePath, potUpdateFile);
                            console.log("Process: Missing updated " + file);
                            potContent = potUpdateFile;
                        }

                        for (let i = 0; i < lines.length; i++) {
                            const line = lines[i];
                            if (line.length == 0) updatedContent += "\n";
                            else if (line.startsWith('"')) {
                                updatedContent += line + "\n";
                            } else if (line.startsWith("#:")) {
                                const msgid = line.substring(2, line.length).trim();
                                let msgstr = lines[i + 2];
                                if (msgstr.match(/msgstr ""/)) {
                                    msgstr = lines[i + 1].replace("msgid", "msgstr");
                                }
                                updatedContent += `msgid "${msgid}"` + "\n" + msgstr + "\n\n";
                                i += 2;
                            }
                        }
                        //console.log(potUpdateFile);
                        fs.writeFileSync(root + "po/" + file.replace(".pot", ".po"), updatedContent);
                        console.log("Process: Converted " + file);
                    }
                });
            })
            console.log("Process: Preparing to convert po files to lang files");
            await new Promise((pro) => setTimeout(() => pro(), 50));
            fs.readdir(root + "po", (err, files) => {
                if (err) {
                    console.error(err);
                    return;
                }

                const reader2 = fs.readFileSync(root + `po/en_US.po`, "utf-8");
                const pos2 = po.parse(reader2);
                const poValues2 = Object.values(pos2.translations[""]);

                files.forEach((file) => {
                    if (file.endsWith(".po")) {
                        const reader = fs.readFileSync(root + `po/${file}`, "utf-8");
                        const pos = po.parse(reader);
                        const lines = reader.split("\n");
                        let item = "";
                        const poValues = Object.values(pos.translations[""]);
                        lines.forEach((line) => {
                            if (line.startsWith("msgid")) {
                                if (line.includes('""')) return;
                                const thing = poValues.find((object) => object.msgid == line.slice(7).slice(0, -1));
                                const thing2 = poValues2.find((object) => object.msgid == line.slice(7).slice(0, -1));
                                const lengtha = thing.msgstr[0].length;
                                item += `${thing.msgid}=${lengtha > 0 ? thing.msgstr[0] : thing2.msgstr[0]}\n`;
                            }
                        });

                        fs.writeFileSync(root + `${file.replace(".po", ".lang")}`, item.slice(0,-1));

                        reader.forEach;
                    }
                });
            });
        }
        convertPotFilesToPo();
    });
});
