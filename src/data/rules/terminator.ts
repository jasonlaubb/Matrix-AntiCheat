import { Ruleset } from "../interface";

export default {
    name: "terminator",
    description: "Automatically stop hackers on the world. No logging or alert. Highest security was given.",
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