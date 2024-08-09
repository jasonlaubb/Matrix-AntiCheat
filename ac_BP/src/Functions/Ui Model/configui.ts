import { Player } from "@minecraft/server";
import Dynamic from "../Config/dynamic_config";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { rawstr } from "../../Assets/Util";
import { error, triggerCommand } from "../chatModel/CommandHandler";
export async function configUI(player: Player, path?: string[]) {
    if (!path) {
        selector(player, []);
        return;
    }
    const pvalue = Dynamic.get(path);
    if (Array.isArray(pvalue) || typeof pvalue == "string" || typeof pvalue == "number" || typeof pvalue == "boolean" || pvalue === undefined) {
        editor(player, path);
    } else {
        selector(player, path);
    }
}
function selector(player: Player, path: string[]) {
    const object = Dynamic.get(path)!;
    const lulka = Object.entries(object).map((entries): [string, string] => {
        if (entries[1] === undefined) {
            entries[1] = "§cundefined";
        } else if (Array.isArray(entries[1])) {
            if (entries[1].length > 0) {
                entries[1] = entries[1].join(", ");
            } else {
                entries[1] = "§c[]";
            }
        } else if (typeof entries[1] == "object") {
            entries[1] = "Object";
        } else if (typeof entries[1] == "string") {
            entries[1] = `"${entries[1].replace(/§(.)/g, `\§$1`)}"`;
        } else {
            entries[1] = String(entries[1]);
        }
        return entries;
    });

    const selectform = new ActionFormData().title(rawstr.drt("ui.config.selector")).body(
        rawstr
            .new()
            .tra("ui.config.loc", path.join("."))
            .str("\n")
            .tra("ui.config.desc", description[path.join(".")] ?? "No description")
            .parse()
    );

    for (const [key, value] of lulka) {
        selectform.button(`§g§l${key}§r\n§8${value}§r`);
    }
    selectform.button(rawstr.drt("ui.exit"), "textures/ui/redX1.png");
    selectform.show(player).then((data) => {
        if (data.canceled) return;
        const selection = lulka[data.selection!];
        if (!selection) return;
        configUI(player, [...path, selection[0]]).catch((e) => error(player, e));
    });
}
const strtypes = ["string", "number", "boolean", "array"];
const boltypes = ["true", "false"];
async function editor(player: Player, path: string[]) {
    new ModalFormData()
        .title(rawstr.drt("ui.config.editor"))
        .dropdown(
            rawstr
                .new()
                .tra("ui.config.loc", path.join("."))
                .str("\n")
                .tra("ui.config.desc", description[path.join(".")] ?? "No description")
                .str("\n")
                .tra("ui.config.type")
                .parse(),
            strtypes,
            0
        )
        .show(player)
        .then((data) => {
            if (data.canceled) return;
            const type = strtypes[data.formValues![0] as number];
            const form = new ModalFormData().title(rawstr.drt("ui.config.editor"));
            switch (type) {
                case "string": {
                    form.textField(rawstr.drt("ui.config.value"), "string");
                    break;
                }
                case "number": {
                    form.textField(rawstr.drt("ui.config.value"), "number");
                    break;
                }
                case "boolean": {
                    form.dropdown(rawstr.drt("ui.config.value"), boltypes);
                    break;
                }
                case "array": {
                    form.textField(rawstr.drt("ui.config.value"), '"abc","def",3.14,7');
                    break;
                }
                default: {
                    throw new Error("Type Error: Undefined case");
                }
            }
            form.show(player).then((data) => {
                if (data.canceled) return;
                const value = data.formValues![0];
                let ans = value;
                if (typeof value == "number") {
                    ans = boltypes[value];
                }
                // Run the config set command.
                triggerCommand(player, `config set ${type} ${path.join(".")} ${ans}`);
            });
        });
}

const description: { [key: string]: string } = {
    "": "This is the config of Matrix AntiCheat.",
    configDataBase: "WARNING - The changes here might not work on dynamic config.",
    enableMovementCheckBypassTag: "Set the true will let player with tag matrix:movementCheckBypassTag for bypass some of the movement check.",
    autoPunishment: "Setting for the how anticheat punishment the player automatically.",
    "autoPunishment.observationMode": "Set to true to disable the final auto punishment of all modules.",
    "autoPunishment.silentMode": "Set to true to disable all the flag messages.",
};
