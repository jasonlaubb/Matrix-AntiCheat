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
        value: true,
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
        value: "rank:"
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
        value: false,
    },
    antiXray: {
        type: "boolean",
        value: false,
    },
    antiXrayGenerateCooldown: {
        type: "number",
        value: 90000,
    },
    antiXrayGhostBlockDensity: {
        type: "number",
        value: 0.03,
    },
};
