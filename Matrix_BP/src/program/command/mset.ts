import { system, Player } from "@minecraft/server";
import { Config } from "../../matrixAPI";
import { fastText, rawtextTranslate } from "../../util/rawtext";
import { ModalFormData } from "@minecraft/server-ui";
import { waitShowModalForm } from "../../util/util";
import type { cmd } from "../../assets/cmd";
const MATCH_REG = /#[(a-zA-Z)|/]+\,[^#,]+#/g;
const TEST_REG = /^(#[(a-zA-Z)|/]+\,[^#,]+#)+$/;
export default [
    {
        cc: {
            name: "m:mset",
            description: "Set multiple configuration values at once.",
            permissionLevel: 2,
        },
        cb(player) {
            system.run(() => loop(player));
            return { status: 0 };
        }
    },
    {
        cc: {
            name: "m:export",
            description: "Exports the current configuration settings.",
            permissionLevel: 2,
        },
        cb(player) {
            system.run(() => {
            const config = Config.getChanges();
            let outputkey = "";
            config.forEach(({ key, value }) => {
                const strkey = key.join("/");
                const type = typeof value;
                const strvalue = type === "boolean" ? (value ? "true" : "false") : value.toString();
                outputkey += `#${strkey},${strvalue}#`;
            });
            player.sendMessage(fastText().addText("§bMatrix§a+ §7> §g").addTran("command.export.title").build());
            system.runTimeout(() => {
                player.sendMessage(outputkey.length > 0 ? outputkey : rawtextTranslate("command.export.empty"));
            });
        });
            return { status: 0 };
        }
    }
] as cmd[];
async function loop(player: Player, i = 1) {
    const data = await waitShowModalForm(
        new ModalFormData()
            .title(rawtextTranslate("command.mset.title"))
            .textField(rawtextTranslate("command.mset.input"), "<key here>")
            .submitButton("Import part " + i),
        player
    );
    if (data === null || data.canceled) return;
    const key = data.formValues![0] as string;
    const match = key.match(MATCH_REG);
    if (match === null || TEST_REG.test(key) === false) {
        player.sendMessage(fastText().addText("§bMatrix§a+ §7> §c").addTran("command.mset.error").build());
        return;
    }
    match.forEach((value) => {
        const [key, ...nv] = value.slice(1, -1).split(",");
        const expectedType = typeof Config.get(key.split("/"));
        if (expectedType === "undefined" || expectedType === "object") return;
        switch (expectedType) {
            case "string":
                Config.set(key.split("/"), String(nv.join(",")));
                break;
            case "boolean":
                Config.set(key.split("/"), nv[0] === "true");
                break;
            case "number":
                const num = parseFloat(nv[0]);
                Config.set(key.split("/"), (isNaN(num) || isFinite(num)) ? 0 : num);
        }
    });
    player.sendMessage(fastText().addText("§bMatrix§a+ §7> §g").addTran("command.mset.success", match.length.toString()).build());
    loop(player, i + 1);
}