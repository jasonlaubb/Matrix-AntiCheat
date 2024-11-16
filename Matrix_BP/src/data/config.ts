export default {
    disableConsoleOutput: false,
    modules: {
        antiFly: true,
        firewall: true,
        antiNamespoof: true,
        antiKillAura: true,
    } as { [key: string]: boolean },
    command: {
        about: true,
    } as { [key: string]: boolean },
    flag: {
        banDuration: 604800,
    }
};
