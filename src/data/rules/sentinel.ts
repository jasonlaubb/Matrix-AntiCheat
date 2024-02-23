import { Player } from "@minecraft/server";
import { Ruleset } from "../interface";
import Util from "../../lib/matrix";

export default {
    name: "sentinel",
    description: "Follow the default punishment, automatically ban or kick them. Log down the record for staff. Recommended to use this mode.",
    rule: {
        action: {
            absloute: "ban",
            stable: "ban",
            unstable: "kick",
            light: "kick"
        },
        maxVL: {
            absloute: 0,
            stable: 4,
            unstable: 7,
            light: 4
        },
        alert: {
            actionFlag: {
                state: true,
                requires: (player: Player) => Util.isAdmin(player),
                log: true
            },
            actionDone: {
                state: true,
                requires: (player: Player) => Util.isAdmin(player),
                log: true
            }
        }
    }
} as Ruleset