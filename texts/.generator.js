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
        const fs = fsModule.default;
        const path = pathModule.default;
        const checkRoot = fs.existsSync("./texts");
        const root = checkRoot ? "./texts/" : "./";

        async function convertPotFilesToPo() {
            console.log("Process: Preparing to convert pot files to po files");
            const { po } = await import("gettext-parser");
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
