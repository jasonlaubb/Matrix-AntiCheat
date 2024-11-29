export default {
    disableConsoleOutput: false,
    security: {
        containsPassword: false,
        passwordHash: "",
    },
    modules: {
        antiSpeed: true,
        antiFly: true,
        antiTimer: true,
        firewall: false, // Not tested :(
        antiNamespoof: true,
        antiKillAura: true,
        antiScaffold: true,
        antiInsteaBreak: false,
        antiReach: true,
    } as { [key: string]: boolean },
    command: {
        about: true,
    } as { [key: string]: boolean },
    flag: {
        banDuration: 604800,
    },
};
