import { world } from "@minecraft/server";
import config from "../data/config";
import { Ruleset } from "../data/interface";
let ruleData: { [key: string]: Ruleset } = {}
export function worldInitializeAfterEvent () {
    const rulesets = config.rules
    for (const rule of rulesets) {
        // Basic check
        if (rule.name && rule.description && rule.rule.action && rule.rule.alert && rule.rule.maxVL) throw new Error("[Ruleset::WorldInitializeAfterEvent] Ruleset did not included rule")
        ruleData[rule.name] = rule
    }
}
export function getRulesets () {
    return Object.values(ruleData)
}
export function getRule () {
    const currentRule = world.getDynamicProperty("current_rule") as string ?? config.antiCheatOptions.followRule.name
    if (!currentRule) throw new Error("[Ruleset::GetRule] Config file is broken, no rule set was found")
    return ruleData[currentRule].rule
}