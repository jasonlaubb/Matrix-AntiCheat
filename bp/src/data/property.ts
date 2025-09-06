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
        value: "admin", // all, admin, exclude (send to all player exclude the cheater), tag (send to player with specfic tag)
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
    specificReasonOnPunishment: {
        type: "boolean",
        value: false, // If set to true, more detailed infomration is given to the disconnected player (unfair advantage)
    },
    enablePunishmentIgnoreTag: {
        type: "boolean",
        value: false,
    },
    antiKillauraEnable: {
        type: "boolean",
        value: true,
    },
    antiKillauraCriticalCheck: {
        type: "boolean",
        value: false,
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
    antiAutotoolEnable: {
        type: "boolean",
        value: true,
    },
    antiAutoToolIgnoreKeyboardInput: {
        type: "boolean",
        value: true, // Enable to prevent decimal cases falses by clicking both hotbar button & left-click for multiple times.
    },
    antiSpeedEnable: {
        type: "boolean",
        value: false,
    },
    antiFlyEnable: {
        type: "boolean",
        value: false,
    },
    antiInstabreakEnable: {
        type: "boolean",
        value: false,
    },
    antiEntityFlyEnable: {
        type: "boolean",
        value: false,
    },
    antiElytraFlyEnable: {
        type: "boolean",
        value: false, // Possible to false
    },
    antiAutoClickerEnable: {
        type: "boolean",
        value: false,
    },
    antiAutoClickerMaxCps: {
        type: "number",
        value: 14,
    },
    antiAutoClickerWarning: {
        type: "boolean",
        value: true, // Send mesage to player & admin when player triggered autoclicker no-punishment flag
    },
    antiAutoClickerMaxFlag: {
        type: "number",
        value: 3,
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
        value: 8, // High value of this might cause HIGH spike lag...
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
    worldBorderNether1to8ratio: {
        type: "boolean",
        value: false, // If set to true, the world border size will be adjusted -> nether 1:8 overworld
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
    antiAfkMaxNotMoved: {
        type: "number",
        value: 600000,
    },
    recordFlags: {
        type: "boolean",
        value: true,
    },
    maxRecordAmount: {
        type: "number",
        value: 20,
    },
    antiSpam: {
        type: "boolean",
        value: false,
    },
    antiSpamFastDef: {
        type: "number",
        value: 3000,
    },
    antiSpamTooFastFlagLimit: {
        type: "number",
        value: 2,
    },
    antiSpamRepeatDef: {
        type: "number",
        value: 15000,
    },
    antiSpamMaxRepeatedArgLength: {
        type: "number",
        value: 3,
    },
    antiSpamMessageMaxLength: {
        type: "number",
        value: 72,
    },
    antiXpEnable: {
        type: "boolean",
        value: false,
    },
    antiFreecamEnable: {
        type: "boolean",
        value: false,
    },
    antiFreecamLockCameraOn: {
        type: "number",
        value: 5000,
    },
    antiFreecamNotify: {
        type: "boolean",
        value: true,
    },
    antiShulkerBoxNesting: {
        type: "boolean",
        value: true,
    },
    antiSurroundEnable: {
        type: "boolean",
        value: true,
    },
    antiFastThrowEnable: {
        type: "boolean",
        value: true,
    },
    antiFastThrowMinInterval: {
        type: "number",
        value: 150,
    },
    antiAimAssistEnable: {
        type: "boolean",
        value: false,
    },
    antiNamespoofEnable: {
        type: "boolean",
        value: true,
    },
    antiNamespoofASCIIOnly: {
        type: "boolean",
        value: true, // Enable to allow only ASCII characters in names, can false.
    },
    antiBlockReachEnable: {
        type: "boolean",
        value: false,
    },
    antiInvalidSprintEnable: {
        type: "boolean",
        value: false,
    },
    antiPhaseEnable: {
        type: "boolean",
        value: false
    },
    antiIllegalItemEnable: {
        type: "boolean",
        value: false,
    },
    antiIllegalItemCheckImpossible: {
        type: "boolean",
        value: true, // Check items that are impossible to obtain in survival mode but possible in creative mode
    },
    antiIllegalItemBanSpawnEgg: {
        type: "boolean",
        value: true, // Delete spawn egg items when detected
    },
    antiIllegalItemCheckUnfair: {
        type: "boolean",
        value: true, // Check items that are considered "unfair" in survival mode, such as command block, structure block, barrier, etc.
    },
    antiIllegalItemBanEducational: {
        type: "boolean",
        value: true, // Ban items that are exclusive to Minecraft: Education Edition and not available in standard editions.
    }
};
