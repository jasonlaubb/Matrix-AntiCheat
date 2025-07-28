/*
    Edit the config here!
    If you updated the value in-game, you can use `/discard <id>` to let anticheat follow this config...
    flagMessageTarget: {
        type: "string", <--- Don't change this
        value: "admin", <--- Only change this
    }, <-- Don't remove this comma
*/
export default {
    flagMessageTarget: {
        type: "string",
        value: "all",
    },
    notifyTag: {
        type: "string",
        value: "flagNotify",
    },
    chatRankEnable: {
        type: "boolean",
        value: false,
    },
    chatRankMessageFormat: {
        type: "string",
        value: "§7[§f{rank}§r§7] §e{player}: §f§r{message}",
    },
    chatRankDisplayOnNameTag: {
        type: "boolean",
        value: false,
    },
    chatRankNameTagFormat: {
        type: "string",
        value: "§7[§f{rank}§r§7] §f{player}",
    },
    chatRankDefaultRank: {
        type: "string",
        value: "Member",
    },
    chatRankTagPrefix: {
        type: "string",
        value: "rank:",
    },
    flagPunishmentType: {
        type: "string",
        value: "kick", // none, kick, ban
    },
    flagBanDuration: {
        type: "number",
        value: 604800000,
    },
    enablePunishmentIgnoreTag: {
        type: "boolean",
        value: false,
    },
    antiKillauraEnable: {
        type: "boolean",
        value: true,
    },
    antiAutototemEnable: {
        type: "boolean",
        value: true,
    },
    antiChestauraEnable: {
        type: "boolean",
        value: true,
    },
    antiZiplineEnable: {
        type: "boolean",
        value: true,
    },
    antiScaffoldEnable: {
        type: "boolean",
        value: true,
    },
    antiExtinguisherEnable: {
        type: "boolean",
        value: true,
    },
    antiBreakerEnable: {
        type: "boolean",
        value: true,
    },
    banXrayHandler: {
        type: "boolean",
        value: true, // Disable all handler related to xray
    },
    antiXray: {
        type: "boolean",
        value: false,
    },
    antiXrayGenerateCooldown: {
        type: "number",
        value: 480000, // Cooldown of a chunk to generate again
    },
    antiXrayGhostBlockDensity: {
        type: "number",
        value: 0.07, // Probability that a block will be generated to a ghost ore
    },
    antiXrayEnhancedGeneration: {
        type: "boolean",
        value: true, // Enable extra generation for also near 8 chunk
    },
    antiXrayMaxChangeInTick: {
        type: "number",
        value: 21, // High value of this might cause HIGH spike lag...
    },
    worldBorder: {
        type: "boolean",
        value: false,
    },
    worldBorderSize: {
        type: "number",
        value: 10000, // Max X, Z diff from the world spawn (doge)
    },
    worldBorderEffect: {
        type: "boolean",
        value: true,
    },
    worldBorderEffectLength: {
        type: "number",
        value: 16,
    },
    worldBorderEffectHeight: {
        type: "number",
        value: 12,
    },
    worldBorderYOffset: {
        type: "number",
        value: 3,
    },
    worldBorderParticle: {
        type: "string",
        value: "minecraft:blue_flame_particle",
    },
    oreAlert: {
        type: "boolean",
        value: false,
    },
    endLock: {
        type: "boolean",
        value: false,
    },
    netherLock: {
        type: "boolean",
        value: false,
    },
    antiAfk: {
        type: "boolean",
        value: false,
    },
};
