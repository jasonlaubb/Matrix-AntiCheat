import { Player } from "@minecraft/server";
import { Ruleset } from "../interface";
import Util from "../../lib/matrix";

export default {
    name: "supervise",
    description: "No punishment was given, send alert to staff when we caught a hacker. Recommended to people who want to catch hacker by the staff only.",
    rule: {
        action: {
            absloute: "none",
            stable: "none",
            unstable: "none",
            light: "none"
        },
        maxVL: {
            absloute: 0,
            stable: 0,
            unstable: 0,
            light: 0
        },
        alert: {
            actionFlag: {
                state: true,
                requires: (player: Player) => Util.isAdmin(player),
                log: false
            },
            actionDone: {
                state: false,
                requires: null,
                log: false
            }
        }
    }
} as Ruleset