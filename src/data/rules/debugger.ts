import { Ruleset } from "../interface";

export default {
    name: "debugger",
    description: "A mode for test, Cancelled all punishment and send flag message to all of the players.",
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
                requires: null,
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