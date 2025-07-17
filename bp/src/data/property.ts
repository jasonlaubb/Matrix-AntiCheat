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
        value: false, // Disable all handler related to xray
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
        value: 0.3, // Probability that a block will be generated to a ghost ore
    },
    antiXrayEnhancedGeneration: {
        type: "boolean",
        value: true, // Enable extra generation for also near 8 chunk
    },
    antiXrayMaxChangeInTick: {
        type: "number",
        value: 21, // High value of this might cause HIGH spike lag...
    },
};
