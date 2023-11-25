/**
 * All possible MinecraftEffectTypes
 */
export declare enum MinecraftEffectTypes {
    Absorption = "absorption",
    BadOmen = "bad_omen",
    Blindness = "blindness",
    ConduitPower = "conduit_power",
    Darkness = "darkness",
    Empty = "empty",
    FatalPoison = "fatal_poison",
    FireResistance = "fire_resistance",
    Haste = "haste",
    HealthBoost = "health_boost",
    Hunger = "hunger",
    InstantDamage = "instant_damage",
    InstantHealth = "instant_health",
    Invisibility = "invisibility",
    JumpBoost = "jump_boost",
    Levitation = "levitation",
    MiningFatigue = "mining_fatigue",
    Nausea = "nausea",
    NightVision = "night_vision",
    Poison = "poison",
    Regeneration = "regeneration",
    Resistance = "resistance",
    Saturation = "saturation",
    SlowFalling = "slow_falling",
    Slowness = "slowness",
    Speed = "speed",
    Strength = "strength",
    VillageHero = "village_hero",
    WaterBreathing = "water_breathing",
    Weakness = "weakness",
    Wither = "wither"
}
/**
 * Union type equivalent of the MinecraftEffectTypes enum.
 */
export type MinecraftEffectTypesUnion = keyof typeof MinecraftEffectTypes;
