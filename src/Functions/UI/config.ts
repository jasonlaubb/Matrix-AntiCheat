import { Player, system } from "@minecraft/server";
import { c } from "../../Assets/Util";
import { ActionFormData, FormCancelationReason, ModalFormData } from "@minecraft/server-ui";

function changeJSON (json: any, keys: string[], newValue: any) {
    let current = json;
  
    for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
                return json;
            }
        current = current[keys[i]];
    }
  
    current[keys[keys.length - 1]] = newValue;

    return json;
}

function getJSON (json: any, keys: string[]) {
    let current = json;
  
    for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
                return json;
            }
        current = current[keys[i]];
    }
  
    return current[keys[keys.length - 1]]
}

function genarateUI (player: Player , path: string[]) {
    const config = c ()
    let keys = getJSON(config, path) ?? config
    keys = Object.entries(keys)

    let stringPath = path.join(".")
    stringPath = stringPath.length > 0 ? "config." + stringPath : "config root"
    const menu = new ActionFormData()
        .title("§g§lConfig UI")
        .body("§7Path: §e" + stringPath)

    for (const key of keys) {
        const type = typeof key

        //menu.button(`§g§l${key[0]}\n§r§8Click here to view`)
        if (key instanceof Array) {
            menu.button(`§g§l${key[0]}\n§r§8[${(key[1] as Array<string>).join(", ")}]`)
        } else if (type !== "object") {
            menu.button(`§g§l${key[0]}\n§r§8${String(key[1])}`)
        } else {
            menu.button(`§g§l${key[0]}\n§r§8(Click here to view)`)
        }
    }
    menu.button("§c§lBACK")

    system.run(() => {
        menu.show(player).then(res => {
            if (res.canceled) {
                if (res.cancelationReason == FormCancelationReason.UserClosed && path.length > 0) {
                    path.pop()
                    genarateUI(player, path)
                }
                return
            }

            const selected = keys[res.selection] ?? "back"

            if (selected == "back") {
                if (path.length > 0) {
                    path.pop()
                    genarateUI(player, path)
                }
                return
            }

            const selectedType = typeof selected[1]

            const holder = getJSON(config, path)
            if (selected[1] instanceof Array) {
                input.array(player, path, holder)
            } else if (selectedType !== "object") {
                if (selectedType == "number") {
                    input.number(player, path, holder)
                } else if (selectedType == "boolean") {
                    input.boolean(player, path, holder)
                } else if (selectedType == "string") {
                    input.string(player, path, holder)
                } //unfinished tag
            } else {
                path.push(selected[0])
                genarateUI(player, path)
            }
        })
    })
}

class input {
    static array (player: Player, path: string[], holder: any[]) {
        const config = c()
        new ModalFormData()
            .title("§g§lInput Value")
            .textField("§7Value: §eArray\n§7Example:§e [apple,banna]\n§c-- Type your value here --", `[${holder.join(",")}]`)
            .show(player).then(res => {
                if (res.canceled) {
                    if (res.cancelationReason == FormCancelationReason.UserClosed) {
                        path.pop()
                        genarateUI(player, path)
                    }
                    return
                }

                const v = res.formValues[0] as string

                if (v === undefined) {
                    path.pop()
                    genarateUI(player, path)
                    return
                }

                const isArrayString = v.startsWith("[") && v.endsWith("]")

                if (!isArrayString) return player.sendMessage(`§bMatrix §7>§g TypeError: You should input an array string`)

                changeJSON (config, path, v.slice(-1).slice(1).split(","))
                path.pop()
                genarateUI(player, path)
            })
    }
    static number (player: Player, path: string[], holder: number) {
        const config = c()
        new ModalFormData()
        .title("§g§lInput Value")
        .textField("§7Value: §eNumber\n§7Example:§e 3.1415\n§c-- Type your value here --", String(holder))
        .show(player).then(res => {
            if (res.canceled) {
                if (res.cancelationReason == FormCancelationReason.UserClosed) {
                    path.pop()
                    genarateUI(player, path)
                }
                return
            }

            const v = res.formValues[0] as string

            if (v === undefined) {
                path.pop()
                genarateUI(player, path)
                return
            }

            const isNumber = !Number.isNaN(Number(v))

            if (!isNumber) return player.sendMessage(`§bMatrix §7>§g TypeError: You should input a valid number`)

            changeJSON (config, path, Number(v))
            path.pop()
            genarateUI(player, path)
        })
    }
    static string (player: Player, path: string[], holder: string) {
        const config = c()
        new ModalFormData()
        .title("§g§lInput Value")
        .textField("§7Value: §eString\n§7Example:§e \"You have been banned\"\n§c-- Type your value here --", String(holder))
        .show(player).then(res => {
            if (res.canceled) {
                if (res.cancelationReason == FormCancelationReason.UserClosed) {
                    path.pop()
                    genarateUI(player, path)
                }
                return
            }

            const v = res.formValues[0] as string

            if (v === undefined) {
                path.pop()
                genarateUI(player, path)
                return
            }

            const isString = v.startsWith('"') && v.endsWith('"')

            if (!isString) return player.sendMessage(`§bMatrix §7>§g TypeError: You should input a valid string`)

            changeJSON (config, path, v.slice(-1).slice(1))
            path.pop()
            genarateUI(player, path)
        })
    }
    static boolean (player: Player, path: string[], holder: boolean) {
        const config = c()
        new ModalFormData()
        .title("§g§lInput Value")
        .toggle("§7Value: §eBoolean\n§7Example:§e true\n§c-- False | True --\n", holder)
        .show(player).then(res => {
            if (res.canceled) {
                if (res.cancelationReason == FormCancelationReason.UserClosed) {
                    path.pop()
                    genarateUI(player, path)
                }
                return
            }

            const v = res.formValues[0] as boolean

            if (v === undefined) {
                path.pop()
                genarateUI(player, path)
                return
            }

            changeJSON (config, path, v)
            path.pop()
            genarateUI(player, path)
        })
    }
}