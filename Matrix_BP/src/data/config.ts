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
        itemCheck: false,
        aimCheck: true,
        antiHop: true,
        welcomer: true,
        worldBorder: false,
        chatRank: false,
        antiAfk: false,
        antiCombatLog: false,
    } as { [key: string]: boolean },
    command: {
        about: true,
    } as { [key: string]: boolean },
    flag: {
        banDuration: 604800,
    },
    worldBorder: {
        borderLength: 1000,
        useWorldSpawn: true,
        centerLocation: {
            x: 0,
            y: 0,
            z: 0,
        }
    },
    chatRank: {
        pattern: "§7§l<§r§f%rank%§l§7> §e%name%: §r%message%",
        splitter: "§r§7,§f",
        defaultRank: "Member",
        topRankOnly: false,
    }
};
