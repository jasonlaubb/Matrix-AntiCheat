import { Ruleset } from "../interface";

export default {
    name: "silent",
    description: "No flag message was given, no punishment for hacker. Just take it easy. Not recommended to use this rule.",
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
                state: false,
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