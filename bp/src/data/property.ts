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
};
