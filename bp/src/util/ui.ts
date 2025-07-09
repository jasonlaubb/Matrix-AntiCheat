import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { detectionList } from "../command/module";
import { get } from "./database";
import property from "../data/property";
export function openGeneralUI (player: Player) {
    new ActionFormData()
        .title("General Settings")
        .button("Enable/Disable detection")
        .button("Change configuration")
        //@ts-expect-error
        .show(player).then((res) => {
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
                        player.runCommand(`matrix:detection ${Object.keys(detectionList)[selection]} ${enableList[selection] ? "false" : "true"}`);
                    });
                    break;
                }
                case 1: {
                    break;
                }
            }
        })
}