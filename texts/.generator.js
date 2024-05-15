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
import("fs").then((fsModule) => {
    import("path").then((pathModule) => {
        let root = module.require.main.filename;
        root = root.endsWith("texts/.generator.js") ? "./" : "./texts/";
        const fs = fsModule.default;
        const path = pathModule.default;

        async function convertPotFilesToPo() {
            const { po } = await import("gettext-parser");
            console.log("Process: Preparing to convert pot files to po files");
            fs.readdir(root + "pot", async (err, files) => {
                if (err) {
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

                files.forEach(async (file) => {
                    if (file.endsWith(".pot")) {
                        const potFilePath = path.join(root + "pot", file);
                        const potContent = fs.readFileSync(potFilePath, "utf8");

                        let lines = potContent.split("\n").filter((a) => !a.startsWith("#") || a.startsWith("#:"));
                        let updatedContent = "";

                        for (let i = 0; i < lines.length; i++) {
                            const line = lines[i];
                            if (line.length == 0) updatedContent += "\n";
                            else if (line.startsWith('"')) {
                                updatedContent += line + "\n";
                            } else if (line.startsWith("#:")) {
                                const msgid = line.substring(2, line.length).trim();
                                let msgstr = lines[i + 2];
                                if (!msgstr.startsWith("msgstr") || msgstr.slice(7).length == 3) {
                                    msgstr = lines[i + 1].replace("msgid", "msgstr");
                                }
                                updatedContent += `msgid "${msgid}"` + "\n" + msgstr + "\n\n";
                                i += 2;
                            }
                        }

                        if (!file.includes("en_US") && fs.existsSync(root + `po/${file.replace(".pot", ".po")}`)) {
                            const basePath = fs.readFileSync(root + "po/en_US.po", "utf8");
                            const basePoV = po.parse(basePath);
                            const baseIds = Object.values(basePoV.translations[""]);

                            const otherPoV = po.parse(fs.readFileSync(root + `po/${file.replace(".pot", ".po")}`, "utf8"));
                            const otherIds = Object.values(otherPoV.translations[""]);

                            if (baseIds.length != otherIds.length) {
                                const notIncluded = baseIds.filter(({ msgid }) => msgid.length > 0 && !otherIds.includes(msgid));
                                const overLoaded = otherIds.filter(({ msgid }) => msgid.length > 0 && !baseIds.includes(msgid))?.map((a) => a.msgid);
                                if (notIncluded || overLoaded) {
                                    console.log(`Warning: Overloaded or not included in base file: ${file}`);
                                    fs.readFile(root + `pot/${file.replace(".pot", ".po")}`, "utf8", (err, potSource) => {
                                        if (err) {
                                            console.error(err);
                                            return;
                                        }

                                        let potLines = potSource.split("\n");
                                        let newPot = "";

                                        if (overLoaded) {
                                            for (let i = 0; i < potLines.length; i++) {
                                                const line = potLines[i];
                                                if (line.startsWith("#:") && overLoaded.some((a) => line.includes(a))) {
                                                    i += 2;
                                                } else {
                                                    newPot += line + "\n";
                                                }
                                            }
                                        }

                                        if (notIncluded) {
                                            notIncluded.forEach(({ msgid, msgstr: [msgstr] }) => {
                                                newPot += "\n\n" + `#: ${msgid}` + "\n" + `msgid "${msgstr}"` + "\n" + 'msgstr ""';
                                            });
                                        }

                                        fs.writeFileSync(root + `pot/${file}`, potLines.join("\n"));
                                        console.log(`Warning Overloaded or not included in base file: ${file}`);
                                        convertPotFilesToPo();
                                    });
                                }

                                fs.writeFileSync(root + `pot/${file}`, potLines.join("\n"));
                                console.log(`Warning Overloaded or not included in base file: ${file}`);
                                await new Promise((pro) => setTimeout(() => pro(), 50));
                                convertPotFilesToPo();
                            }
                        }
                    }
                });

                const poFilePath = root + `po/${file.replace(".pot", ".po")}`;
                fs.writeFileSync(poFilePath, updatedContent);

                console.log(`Process: Modified to po file from pot file: ${poFilePath}`);
            });
            console.log("Process: Preparing to convert po files to lang files");
            await new Promise((pro) => setTimeout(() => pro(), 50));
            fs.readdir(root + "po", (err, files) => {
                if (err) {
                    console.error(err);
                    return;
                }

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
                                item += `${thing.msgid}=${thing.msgstr[0]}\n`;
                            }
                        });

                        fs.writeFileSync(root + `${file.replace(".po", ".lang")}`, item);

                        reader.forEach;
                    }
                });
            });
        }
        convertPotFilesToPo();
    });
});
