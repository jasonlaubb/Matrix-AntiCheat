import { Player, world } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { detectionList } from "../command/module";
import { get } from "./database";
import property from "../data/property";
import { getPropertyType } from "./propertyClassifier";
export function openGeneralUI (player: Player) {
    new ActionFormData()
        .title("General Settings")
        .button("Enable/Disable detection")
        .button("Change configuration")
        //@ts-expect-error
        .show(player)
        .then((res) => {
            if (res.canceled) return;
            switch (res.selection) {
                case 0: {
                    const ui = new ActionFormData()
                        .title("AntiCheat Settings");
                    const enableList = Object.entries(detectionList).map(([name, detection]) => {
                        const enabled = get(detection.property as keyof typeof property);
                        ui.button(`${enabled ? "§a" : "§c"}${name}\n§8${enabled ? "Choose to disable" : "Choose to enable"}`);
                        return enabled;
                    });
                    //@ts-expect-error
                    ui.show(player).then((res) => {
                        if (res.canceled) return;
                        const selection = res.selection!;
                        const toggle = Object.values(detectionList)[selection];
                        if (enableList[selection]) {
                            world.setDynamicProperty(toggle.property, false);
                            toggle.enable();
                        } else {
                            toggle.disable();
                            world.setDynamicProperty(toggle.property, true);
                        }
                    });
                    break;
                }
                case 1: {
                    new ActionFormData()
                        .title("Manage properties")
                        .body("Select data type you want to change:")
                        .button("Boolean")
                        .button("String")
                        .button("Number")
                        //@ts-expect-error
                        .show(player)
                        .then((res) => {
                            if (res.canceled) return;
                            const { booleanValue, stringValue, numberValue } = getPropertyType();
                            const selectedProperty = [booleanValue, stringValue, numberValue][res.selection!];
                            if (selectedProperty.length === 0) {
                                player.sendMessage("§7[§aMatrix§7] §fSorry, there hasn't been any valid property for that type yet!")
                                return;
                            }
                            new ModalFormData()
                                .title("Select property")
                                .dropdown("Select the property you want to view or change", selectedProperty, { defaultValueIndex: 0 })
                                //@ts-expect-error
                                .show(player)
                                .then((res) => {
                                    if (res.canceled) return;
                                    const selection = res.formValues![0] as number;
                                    const selectedId = selectedProperty[selection];
                                    const { type, value } = property[selectedId as keyof typeof property];
                                    const dynamicValue = world.getDynamicProperty("database:" + selectedId) ?? "--";
                                    new ActionFormData()
                                        .title("Property: " + selectedId)
                                        .body(`§gType: §e${type}\n§gStatic data: §e${value}§r\n§gDynamic property: §e${dynamicValue}`)
                                        .button("Modify value")
                                        .button("Discard edit")
                                        //@ts-expect-error
                                        .show(player)
                                        .then((res) => {
                                            if (res.canceled) return;
                                            if (res.selection! === 0) {
                                                const ui = new ModalFormData()
                                                    .title("Editing: " + selectedId);
                                                (type === "boolean" ? ui.toggle("New boolean state", { defaultValue: true }) : ui.textField(`New value (${type})`, "New value"))
                                                    //@ts-expect-error
                                                    .show(player)
                                                    .then((res) => {
                                                        if (res.canceled) return;
                                                        const value = res.formValues![0] as string;
                                                        if (!value) return player.sendMessage("§7[§aMatrix§7] §fNew value cannot be empty. Please use /discard to reset a value.");
                                                        switch (type) {
                                                            case "string": {
                                                                world.setDynamicProperty("database:" + selectedId, value);
                                                                break;
                                                            }
                                                            case "number": {
                                                                const number = parseFloat(value);
                                                                if (isNaN(number)) return player.sendMessage("§7[§aMatrix§7] §fNot a number!");
                                                                world.setDynamicProperty("database:" + selectedId, value);
                                                                break;
                                                            }
                                                            case "boolean": {
                                                                const boolean = res.formValues![0] as boolean;
                                                                world.setDynamicProperty("database:" + selectedId, boolean);
                                                                break;
                                                            }
                                                        }
                                                        player.sendMessage("§7[§aMatrix§7] §fSuccessfully changed selected property.");
                                                    });
                                            } else {
                                                if (world.getDynamicProperty("database:" + selectedId)) {
                                                    world.setDynamicProperty("database:" + selectedId);
                                                    player.sendMessage("§7[§aMatrix§7] §fSuccessfully reset selected property.");
                                                } else player.sendMessage("§7[§aMatrix§7] §fTarget property has not been changed.");
                                            }
                                        })
                                });
                        })
                    break;
                }
            }
        })
}