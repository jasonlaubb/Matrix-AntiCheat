export default {
    disableConsoleOutput: false,
    modules: {
        antiSpeed: true,
        antiFly: true,
        antiTimer: true,
        firewall: true,
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
    }
};