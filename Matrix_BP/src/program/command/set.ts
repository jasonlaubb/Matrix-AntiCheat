import { Command, Config } from "../../matrixAPI";
import { fastText, rawtextTranslate } from "../../util/rawtext";

new Command()
    .setName("set")
    .setMinPermissionLevel(3)
    .setAliases("config", "setconfig", "configset", "setting")
    .setDescription(rawtextTranslate("command.set.description"))
    .addOption(rawtextTranslate("command.set.key"), rawtextTranslate("command.set.key.description"), "string")
    .addOption(rawtextTranslate("command.set.value"), rawtextTranslate("command.set.value.description"), "string")
    .onExecute(async (player, key, value) => {
        const path = (key as string).split("/");
        const isValid = Config.isValid(path);
        if (!isValid) {
            player.sendMessage(
                fastText()
                    .addText("§bMatrix§a+ §7> §c")
                    .addTran("command.set.invalid", key as string)
                    .build()
            );
            return;
        }
        const typeExpected = typeof Config.get(path);
        let typeValue = value as string | number | boolean;
        switch (typeExpected) {
            case "string": {
                Config.set(path, value as string);
                break;
            }
            case "number": {
                const numberForm = parseInt(value as string);
                if (Number.isNaN(numberForm)) {
                    player.sendMessage(fastText().addText("§bMatrix§a+ §7> §c").addTran("command.set.number").build());
                    return;
                }
                typeValue = numberForm;
                break;
            }
            case "boolean": {
                if (value != "true" && value != "false") {
                    player.sendMessage(fastText().addText("§bMatrix§a+ §7> §c").addTran("command.set.boolean").build());
                    return;
                }
                typeValue = value == "true";
                break;
            }
            case "object": {
                player.sendMessage(fastText().addText("§bMatrix§a+ §7> §c").addTran("command.set.access").build());
                return;
            }
            default: {
                throw new Error("Unexpected type");
            }
        }
        Config.set(path, typeValue);
        player.sendMessage(
            fastText()
                .addText("§bMatrix§a+ §7> §g")
                .addTran("command.set.success", key as string, value as string)
                .build()
        );
    })
    .register();
