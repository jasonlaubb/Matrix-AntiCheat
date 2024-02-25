/**
 * @author Matrix Team
 * @description The config json of the AntiCheat
 * 
 * @warning
 * The setting of config maybe changed in dynamic properties (change config will not effect the server)
 * 
 * @docs https://transform.tools/json-to-typescript
 */

import silent from "./rules/silent"
import debugger_ from "./rules/debugger"
import supervise from "./rules/supervise"
import sentinel from "./rules/sentinel"
import terminator from "./rules/terminator"

export default {
    /** 
     * @description
     * The setting for our functions
     */
    antiCheatOptions: {
        configVersion: 1, // version of config, useless
        language: "en_US", // default language
        createScoreboard: true, // create betaAPI scoreboard on boot
        followRule: sentinel, // default rule should anticheat follow
        betaAPITracker: true, // optional, state if anticheat will create a scoreboard with script.
    },
    commandOptions: {
        password: "password", // The password for op command
        prefix: "-", // The prefix of commands
        otherPrefix: [],
        passwordCoolDown: 5000, // ms
    },
    commands: {
        about: true,
        borderSize: true,
        defaultrank: true,
        help: true,
        passwords: true,
        showallrank: true,
        toggle: true,
        toggles: true
    },
    rules: [
        silent,
        debugger_,
        supervise,
        sentinel,
        terminator
    ], // Export the rulesets to the anticheat
    punishment: {
        kick: {
            reason: "Unfair advantage"
        },
        ban: {
            minutes: 1440,
            reason: "Unfair advantage"
        }
    },
    modules: {
        fly: {
            enabled: true,
            id: "antiFly",
            RUMF: {
                group: "stable",
                action: { type: 2, duration: 40 },
                maxVelocity: 0.7, // min velocity will be stated as upward movement
                minFallDistance: -1.5, // min fall distance to trigger anti-bypass
                sensitivity: 100, // sensitivity will increase with working efficiency
            }
        },
    },
    utility: {
        worldBorder: {
            enabled: false,
            radius: 120000
        }
    }
}
