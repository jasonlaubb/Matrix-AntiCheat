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
    antikillauraEnable: {
        type: "boolean",
        value: true,
    },
    antiautototemEnable: {
        type: "boolean",
        value: true,
    },
    antichestauraEnable: {
        type: "boolean",
        value: true,
    },
    antiziplineEnable: {
        type: "boolean",
        value: true,
    },
    antiscaffoldEnable: {
        type: "boolean",
        value: true,
    },
    antiextinguisherEnable: {
        type: "boolean",
        value: true,
    },
};
