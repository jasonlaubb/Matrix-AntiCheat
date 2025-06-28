/**
 * All possible MinecraftFeatureTypes
 */
export declare enum MinecraftFeatureTypes {
    AncientCity = "minecraft:ancient_city",
    BastionRemnant = "minecraft:bastion_remnant",
    BuriedTreasure = "minecraft:buried_treasure",
    EndCity = "minecraft:end_city",
    Fortress = "minecraft:fortress",
    Mansion = "minecraft:mansion",
    Mineshaft = "minecraft:mineshaft",
    Monument = "minecraft:monument",
    PillagerOutpost = "minecraft:pillager_outpost",
    RuinedPortal = "minecraft:ruined_portal",
    Ruins = "minecraft:ruins",
    Shipwreck = "minecraft:shipwreck",
    Stronghold = "minecraft:stronghold",
    Temple = "minecraft:temple",
    TrailRuins = "minecraft:trail_ruins",
    TrialChambers = "minecraft:trial_chambers",
    Village = "minecraft:village"
}
/**
 * Union type equivalent of the MinecraftFeatureTypes enum.
 */
export type MinecraftFeatureTypesUnion = keyof typeof MinecraftFeatureTypes;
