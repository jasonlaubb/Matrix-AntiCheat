/**
 * All possible MinecraftEffectTypes
 */
export declare enum MinecraftEffectTypes {
    Absorption = "minecraft:absorption",
    BadOmen = "minecraft:bad_omen",
    Blindness = "minecraft:blindness",
    ConduitPower = "minecraft:conduit_power",
    Darkness = "minecraft:darkness",
    FatalPoison = "minecraft:fatal_poison",
    FireResistance = "minecraft:fire_resistance",
    Haste = "minecraft:haste",
    HealthBoost = "minecraft:health_boost",
    Hunger = "minecraft:hunger",
    Infested = "minecraft:infested",
    InstantDamage = "minecraft:instant_damage",
    InstantHealth = "minecraft:instant_health",
    Invisibility = "minecraft:invisibility",
    JumpBoost = "minecraft:jump_boost",
    Levitation = "minecraft:levitation",
    MiningFatigue = "minecraft:mining_fatigue",
    Nausea = "minecraft:nausea",
    NightVision = "minecraft:night_vision",
    Oozing = "minecraft:oozing",
    Poison = "minecraft:poison",
    RaidOmen = "minecraft:raid_omen",
    Regeneration = "minecraft:regeneration",
    Resistance = "minecraft:resistance",
    Saturation = "minecraft:saturation",
    SlowFalling = "minecraft:slow_falling",
    Slowness = "minecraft:slowness",
    Speed = "minecraft:speed",
    Strength = "minecraft:strength",
    TrialOmen = "minecraft:trial_omen",
    VillageHero = "minecraft:village_hero",
    WaterBreathing = "minecraft:water_breathing",
    Weakness = "minecraft:weakness",
    Weaving = "minecraft:weaving",
    WindCharged = "minecraft:wind_charged",
    Wither = "minecraft:wither"
}
/**
 * Union type equivalent of the MinecraftEffectTypes enum.
 */
export type MinecraftEffectTypesUnion = keyof typeof MinecraftEffectTypes;
