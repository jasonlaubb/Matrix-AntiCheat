import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { Module } from "../../matrixAPI";
import { fastText, rawtextTranslate } from "../../util/rawtext";
import { waitShowActionForm, waitShowModalForm } from "../../util/util";
import { mdlType } from "../../data/category";
import { Player, system } from "@minecraft/server";
import type { cmd } from "../../assets/cmd";
async function extraUI(player: Player) {
    const select = new ActionFormData().title(fastText().addTran("command.listmodule.title").addText(" | Matrix Anticheat").build()).body(rawtextTranslate("command.listmodule.body")).button(rawtextTranslate("ui.exit"));
    for (const { name, icon } of mdlType) {
        select.button(name, icon);
    }
    const selResult = await waitShowActionForm(select, player);
    if (!selResult || selResult.canceled || selResult.selection === 0) return;
    const selectedType = selResult.selection! - 1;
    const isOther = selectedType === mdlType.length - 1;
    return Module.registeredModule.filter(({ tag }) => {
        if (tag === undefined || tag < 0) return isOther;
        return tag === selectedType;
    });
}
export default {
    cc: {
        name: "m:listmodule",
        description: "Lists all modules and their states.",
        permissionLevel: 2,
        cheatsRequired: false
    },
    cb(player) {
        system.run(async () => {
            let allModules = Module.registeredModule;
        if (Module.config.customize.moduleCategory) {
            const selResult = await extraUI(player);
            if (!selResult) return;
            allModules = selResult;
        }
        const listModule = new ActionFormData().title(fastText().addTran("command.listmodule.title").addText(" | Matrix Anticheat").build()).body(rawtextTranslate("command.listmodule.body")).button(rawtextTranslate("ui.exit"));
        allModules.forEach((module) => {
            const toggleId = module.getToggleId()!;
            const isEnabled = Module.config.modules[toggleId]?.state;
            const button = isEnabled ? { colour: "§l§2", icon: "textures/ui/protection-enabled.png" } : { colour: "§l§c", icon: "textures/ui/protection-disabled.png" };
            listModule.button(fastText().addText(button.colour).addRawText(module.getName()).endline().addText("§r§8").addTran(module.getToggleId()!).build(), button.icon);
        });
        player.sendMessage(rawtextTranslate("ui.closechat"));
        const result = await waitShowActionForm(listModule, player);
        if (!result || result.canceled || result.selection! == 0) return;
        const selectedModule = allModules[result.selection! - 1]!;
        const ui = new ModalFormData()
            .title(rawtextTranslate("command.listmodule.toggle.title"))
            .dropdown(
                fastText().addTran("command.listmodule.toggle.body").endline().addRawText(selectedModule.getName()).addText(": ").addRawText(selectedModule.getDescription()).endline().addTran("command.listmodule.toggle.state").build(),
                [rawtextTranslate("command.listmodule.toggle.disable"), rawtextTranslate("command.listmodule.toggle.enable")],
                { defaultValueIndex: 0 }
            )
            .submitButton(rawtextTranslate("ui.runcommand"));
        waitShowModalForm(ui, player).then((result) => {
            if (!result || result.canceled) return;
            const state = result.formValues![0]!;
            const toggleId = selectedModule.getToggleId()!;
            // For the command handler, 0 & 1 can be used as false & true
            player.runChatCommand("setmodule", toggleId, state.toString());
        });
        })
    }
} as cmd;