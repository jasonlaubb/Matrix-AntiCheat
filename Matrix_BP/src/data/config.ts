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
        captcha: false,
    } as { [key: string]: boolean },
    command: {
        about: true,
        help: true,
        op: true,
        deop: true,
        setmodule: true,
        listmodule: true,
        set: true,
        matrixui: true,
        vanish: true,
        kick: true,
        ban: true,
        softban: true,
        mute: true,
        unmute: true,
        unfreeze: true,
        unsoftban: true,
        warn: true,
        clearwarn: true,
        invsee: true,
        setpassword: true,
        clearpassword: true,
        configui: true,
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
        },
    },
    chatRank: {
        pattern: "§7§l<§r§f%rank%§l§7> §e%name%: §r%message%",
        splitter: "§r§7,§f",
        defaultRank: "Member",
        topRankOnly: false,
    },
};
