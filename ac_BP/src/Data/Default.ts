/**
 * @author Matrix Team
 * @description Default preset for AntiCheat
 * @warning NEVER CHANGE THIS FILE IF YOU DON'T KNOW WHAT YOU ARE DOING
 */
export default {
    antiCheatTestMode: false,
    configDataBase: {
        enabled: true,
        autorecover: true,
        confuse: 5,
        mark: "MATRIX_CONFIG_DATABASE",
        hashlength: 16,
        base64Encode: true,
        sendDataBaseMessage: true,
        autoCommit: true,
    },
    sendInitMsg: true,
    sendModuleInitMsg: false,
    createScoreboard: true,
    soundEffect: true,
    flagMode: "admin",
    lockdowncode: "AbCdEfGh",
    passwordCold: 5000,
    spawnFinishDelay: 1200,
    debug: false,
    // Set the true will let player with tag matrix:movementCheckBypassTag for bypass some of the movement check.
    enableMovementCheckBypassTag: false,
    commands: {
        otherPrefix: [],
        passwordSetting: {
            enabled: false,
            password: "type_your_password_here",
            hash: "",
            usingHash: false,
            givenLevel: 4,
        },
        prefix: "-",
        help: {
            enabled: true,
            adminOnly: true,
            minPermissionLevel: 0,
            requireOp: false,
            requireTag: [],
        },
        toggles: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            requireOp: false,
            minPermissionLevel: 1,
        },
        toggle: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            requireOp: false,
            minPermissionLevel: 2,
        },
        setutil: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            requireOp: false,
            minPermissionLevel: 2,
        },
        // Important command.
        op: {
            enabled: true,
            adminOnly: false,
            requireTag: [],
            requireOp: false,
            minPermissionLevel: 0,
        },
        deop: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            requireOp: false,
            minPermissionLevel: 3,
        },
        flagmode: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            requireOp: false,
            minPermissionLevel: 2,
        },
        rank: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            requireOp: false,
            minPermissionLevel: 1,
        },
        rankclear: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            requireOp: false,
            minPermissionLevel: 1,
        },
        defaultrank: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            requireOp: false,
            minPermissionLevel: 2,
        },
        showallrank: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            requireOp: false,
            minPermissionLevel: 2,
        },
        ban: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            requireOp: false,
            minPermissionLevel: 1,
        },
        banqueue: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            requireOp: false,
            minPermissionLevel: 1,
        },
        unban: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            requireOp: false,
            minPermissionLevel: 1,
        },
        tempkick: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            requireOp: false,
            minPermissionLevel: 1,
        },
        freeze: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            requireOp: false,
            minPermissionLevel: 1,
        },
        unfreeze: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            requireOp: false,
            minPermissionLevel: 1,
        },
        mute: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            requireOp: false,
            minPermissionLevel: 1,
        },
        unmute: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            requireOp: false,
            minPermissionLevel: 1,
        },
        vanish: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            requireOp: false,
            minPermissionLevel: 1,
        },
        unvanish: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            requireOp: false,
            minPermissionLevel: 1,
        },
        invcopy: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            requireOp: false,
            minPermissionLevel: 1,
        },
        invsee: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            requireOp: false,
            minPermissionLevel: 1,
        },
        invof: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            requireOp: false,
            minPermissionLevel: 1,
        },
        echestwipe: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            requireOp: false,
            minPermissionLevel: 1,
        },
        lockdowncode: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            requireOp: false,
            minPermissionLevel: 2,
        },
        lockdown: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            requireOp: false,
            minPermissionLevel: 2,
        },
        unlock: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            requireOp: false,
            minPermissionLevel: 2,
        },
        adminchat: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            requireOp: false,
            minPermissionLevel: 0,
        },
        bordersize: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            requireOp: false,
            minPermissionLevel: 2,
        },
        matrixui: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            requireOp: false,
            minPermissionLevel: 1,
        },
        itemui: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            requireOp: false,
            minPermissionLevel: 1,
        },
        banrun: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            requireOp: false,
            minPermissionLevel: 2,
        },
        openlog: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            requireOp: false,
            minPermissionLevel: 1,
        },
        antispam: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            requireOp: false,
            minPermissionLevel: 2,
        },
        bypasslist: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            requireOp: false,
            minPermissionLevel: 1,
        },
        packetlogger: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            requireOp: true,
            minPermissionLevel: 0,
        },
        setprefix: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            requireOp: false,
            minPermissionLevel: 2,
        },
        report: {
            enabled: true,
            adminOnly: false,
            minPermissionLevel: 0,
            requireTag: [],
            requireOp: false,
            commandUsingCooldown: 120000,
        },
        warn: {
            enabled: true,
            adminOnly: true,
            minPermissionLevel: 1,
            requireTag: [],
            maxWarns: 3,
            maxWarnAction: "ban",
            requireOp: false,
        },
        directaction: {
            enabled: true,
            adminOnly: true,
            minPermissionLevel: 1,
            requireTag: [],
            requireOp: false,
        },
        runcommand: {
            enabled: true,
            adminOnly: true,
            minPermissionLevel: 1,
            requireTag: [],
            requireOp: true,
        },
        gm: {
            enabled: true,
            adminOnly: true,
            minPermissionLevel: 1,
            requireOp: true,
            requireTag: [],
        },
        setadmin: {
            enabled: true,
            adminOnly: true,
            minPermissionLevel: 1,
            requireOp: false,
            requireTag: [],
        },
        deladmin: {
            enabled: true,
            adminOnly: true,
            minPermissionLevel: 1,
            requireOp: false,
            requireTag: [],
        },
        setpassword: {
            enabled: true,
            adminOnly: true,
            minPermissionLevel: 4,
            requireOp: false,
            requireTag: [],
        },
        clearpassword: {
            enabled: true,
            adminOnly: true,
            minPermissionLevel: 4,
            requireOp: false,
            requireTag: [],
        },
        ping: {
            enabled: true,
            adminOnly: true,
            minPermissionLevel: 1,
            requireOp: false,
            requireTag: [],
        },
        fakeleave: {
            enabled: true,
            adminOnly: true,
            minPermissionLevel: 1,
            requireOp: false,
            requireTag: [],
        },
    },
    ui: {},
    /*
    defender: {
        enabled: false,
        blockMessage: true,
        tryAbilityBlockage: true,
        antibot: {
            enabled: true,
            type: 0,
            tolerance: 90,
        },
        antialtspam: {
            enabled: true,
            dobanning: false,
        },
        antisleepspam: {
            enabled: true,
            minSleepInterval: 500,
            maxSleepAmountPerMins: 10,
            timeout: 45000,
        },
        antimassspam: {
            enabled: true,
            joinThreshold: 3, // Max amount of join without spawning in 2 mins
            spawnThreshold: 2, // Max amount of initial spawn in 2 mins
            timeout: 65000,
        },
    },*/
    realmDefender: {
        enabled: false,
        maxAllowanceTime: 180000,
    },
    autoPunishment: {
        maxSusValue: 2.5,
        defaultFlagValidationTime: 2100000,
        bypasslist: [],
        bypassname: [],
        observationMode: false,
        silentMode: false,
        kick: {
            reason: "Unfair advantage",
        },
        ban: {
            minutes: 1440, // a day
            reason: "Unfair advantage",
        },
        tempBanLength: 60000,
        behaviorMax: 8,
        eachTimeValidt: 10800000, // 3 hours
        behaviorBanLengthMins: 4320, // 3 days
        resultGobalize: true,
    },
    banModify: {
        extraMessages: [],
    },
    logsettings: {
        maxStorge: 200,
        pageShows: 20,
        utc: 0,
        logCommandUsage: false,
        logPlayerRegister: false,
        logCheatFlag: true,
        logCheatPunishment: true,
    },
    chatRank: {
        enabled: true,
        defaultRank: "§pMember",
        showAllRank: true,
        enhanceCompatibility: false,
        ignorePrefixes: [],
    },
    intergradedAntiSpam: {
        enabled: true,
        chatFilter: {
            enabled: true,
        },
        linkEmailFilter: {
            enabled: true,
        },
        spamFilter: {
            enabled: true,
            maxRepeats: 4,
            maxLength: 128,
            maxMessagesInFiveSeconds: 2,
        },
    },
    welcomer: {
        enabled: true,
        joinedbeforetag: "matrix:joined_before",
        delay: 100,
    },
    dimensionLock: {
        enabled: false,
    },
    antiAutoClicker: {
        enabled: true,
        maxClicksPerSecond: 24,
        timeout: 2000,
        minInterval: 35,
        modules: {
            referencedFlags: 12,
            id: "Auto Clicker",
            configId: "antiAutoClicker",
            maxFlags: 20,
            instantPunishment: false,
            acceptTotal: false,
            flagValidationTime: 0,
            bestPunishment: "none",
            behaviorBased: false,
        },
    },
    antiKillAura: {
        enabled: true,
        minAngle: 160,
        timeout: 200,
        maxEntityHit: 2,
        // For Anti KillAura Type K
        trackLength: 10,
        maxIncreasingCombos: 7,
        minIncreasingCombos: 3,
        silentData: false,
        modules: {
            id: "Kill Aura",
            configId: "antiKillAura",
            referencedFlags: 2,
            maxFlags: 5,
            instantPunishment: false,
            acceptTotal: true,
            flagValidationTime: 0,
            bestPunishment: "ban",
            behaviorBased: false,
        },
    },
    antiMobAura: {
        enabled: true,
        minHitRequired: 3,
        spawnHeightOffset: 2.4,
        spawnRadius: 2,
        comboTime: 15000,
        modules: {
            id: "Mob Aura",
            configId: "antiMobAura",
            referencedFlags: 4,
            maxFlags: 10,
            instantPunishment: false,
            acceptTotal: true,
            flagValidationTime: 0,
            bestPunishment: "tempban",
            behaviorBased: false,
        },
    },
    antiReach: {
        enabled: true,
        maxReach: 4.21,
        maxYReach: 4.8,
        modules: {
            id: "Reach",
            configId: "antiReach",
            referencedFlags: 4,
            maxFlags: 10,
            instantPunishment: false,
            acceptTotal: true,
            flagValidationTime: 0,
            bestPunishment: "tempban",
            behaviorBased: false,
        },
    },
    antiFly: {
        enabled: true,
        highVelocity: 0.7,
        maxGroundPrviousVelocity: 0.5,
        maxHighVelocity: 22,
        illegalFallTerminal: -3.92,
        maxFallTerminal: -3.5,
        bypassFallDis: 300,
        modules: {
            id: "Fly",
            configId: "antiFly",
            referencedFlags: 2,
            maxFlags: 5,
            instantPunishment: false,
            acceptTotal: true,
            flagValidationTime: 0,
            bestPunishment: "ban",
            behaviorBased: true,
        },
    },
    /** @warn Unfinished */
    antiAirJump: {
        enabled: false,
        ratioThreshold: 0.5,
        minDataRequired: 5,
        modules: {
            id: "Air Jump",
            configId: "antiAirJump",
            referencedFlags: 4,
            maxFlags: 10,
            instantPunishment: false,
            acceptTotal: true,
            flagValidationTime: 0,
            bestPunishment: "ban",
            behaviorBased: true,
        },
    },
    antiNoFall: {
        enabled: true,
        float: 15,
        modules: {
            id: "No Fall",
            configId: "antiNoFall",
            referencedFlags: 0,
            maxFlags: 0,
            instantPunishment: true,
            acceptTotal: false,
            flagValidationTime: 0,
            bestPunishment: "ban",
            behaviorBased: true,
        },
    },
    antiMotion: {
        enabled: true,
        punishment: "ban",
        maxWrapDistance: 196,
        wrapDistanceThereshold: 1.6,
        predictionThereshold: 0.25,
        modules: {
            id: "Motion",
            configId: "antiMotion",
            referencedFlags: 3,
            maxFlags: 10,
            instantPunishment: false,
            acceptTotal: true,
            flagValidationTime: 0,
            bestPunishment: "ban",
            behaviorBased: true,
        },
    },
    antiPhase: {
        enabled: true,
        punishment: "ban",
        minSpeed: 2.5,
        breakSolidBypass: 1750,
        modules: {
            id: "Phase",
            configId: "antiPhase",
            referencedFlags: 4,
            maxFlags: 4,
            instantPunishment: false,
            acceptTotal: true,
            flagValidationTime: 0,
            bestPunishment: "tempban",
            behaviorBased: true,
        },
    },
    antiSpeed: {
        enabled: true,
        maxBlockPerSecond: 14,
        checkInterval: 10,
        modules: {
            id: "Speed",
            configId: "antiSpeed",
            referencedFlags: 4,
            maxFlags: 10,
            instantPunishment: false,
            acceptTotal: true,
            flagValidationTime: 0,
            bestPunishment: "ban",
            behaviorBased: true,
        },
    },
    bdsPrediction: {
        enabled: true,
        commonThreshold: 0.7,
        inSolidThreshold: 1.3,
        damageThreshold: 3,
        validFlagDuration: 32000,
        maxFlagInDuration: 3,
        flagDurationIncrase: 5000,
        absThreshould: 1,
        modules: {
            id: "bdsPrediction",
            configId: "bdsPrediction",
            referencedFlags: 2,
            maxFlags: 5,
            instantPunishment: false,
            acceptTotal: true,
            flagValidationTime: 0,
            bestPunishment: "ban",
            behaviorBased: true,
        },
    },
    antiTimer: {
        enabled: true,
        minTimerLog: 3,
        maxTickMovment: 196, // 12 cunks distance
        tickMovementCooldown: 8000,
        modules: {
            id: "Timer",
            configId: "antiTimer",
            referencedFlags: 0,
            maxFlags: 0,
            instantPunishment: true,
            acceptTotal: false,
            flagValidationTime: 0,
            bestPunishment: "ban",
            behaviorBased: true,
        },
    },
    antiNuker: {
        enabled: true,
        maxBreakPerTick: 6,
        timeout: 100,
        solidOnly: true,
        modules: {
            id: "Nuker",
            configId: "antiNuker",
            referencedFlags: 0,
            maxFlags: 0,
            instantPunishment: true,
            acceptTotal: false,
            flagValidationTime: 0,
            bestPunishment: "ban",
            behaviorBased: false,
        },
    },
    antiScaffold: {
        enabled: true,
        timeout: 20,
        maxAngle: 175,
        factor: 1,
        minRotation: 20,
        maxBPS: 5,
        modules: {
            id: "Scaffold",
            configId: "antiScaffold",
            referencedFlags: 5,
            maxFlags: 12,
            instantPunishment: false,
            acceptTotal: true,
            flagValidationTime: 0,
            bestPunishment: "tempkick",
            behaviorBased: false,
        },
    },
    antiNoSlow: {
        enabled: true,
        maxWebSpeed: 0.85,
        maxItemSpeed: 0.2,
        itemUseTime: 350,
        timeout: 60,
        modules: {
            id: "No Slow",
            configId: "antiNoSlow",
            referencedFlags: 1,
            maxFlags: 5,
            instantPunishment: false,
            acceptTotal: true,
            flagValidationTime: 0,
            bestPunishment: "ban",
            behaviorBased: true,
        },
    },
    antiBreaker: {
        enabled: false,
        timeout: 60,
        writeList: ["minecraft:cake", "minecraft:dragon_egg"],
        experimental: true,
        modules: {
            id: "Breaker",
            configId: "antiBreaker",
            referencedFlags: 2,
            maxFlags: 7,
            instantPunishment: false,
            acceptTotal: true,
            flagValidationTime: 0,
            bestPunishment: "ban",
            behaviorBased: true,
        },
    },
    antiSpammer: {
        enabled: true,
        modules: {
            id: "Spammer",
            configId: "antiSpammer",
            referencedFlags: 0,
            maxFlags: 0,
            instantPunishment: true,
            acceptTotal: false,
            flagValidationTime: 0,
            bestPunishment: "ban",
            behaviorBased: false,
        },
    },
    antiBlockReach: {
        enabled: false,
        maxPlaceDistance: 8,
        maxBreakDistance: 8,
        timeout: 60,
        modules: {
            id: "Block Reach",
            configId: "antiBlockReach",
            referencedFlags: 0,
            maxFlags: 0,
            instantPunishment: true,
            acceptTotal: false,
            flagValidationTime: 0,
            bestPunishment: "ban",
            behaviorBased: false,
        },
    },
    antiAim: {
        enabled: false,
        experimental: true,
        modules: {
            id: "Aim",
            configId: "antiAim",
            referencedFlags: 24,
            maxFlags: 35,
            instantPunishment: false,
            acceptTotal: false,
            flagValidationTime: 0,
            bestPunishment: "tempkick",
            behaviorBased: false,
        },
    },
    antiTower: {
        enabled: true,
        minDelay: 200,
        timeout: 60,
        modules: {
            id: "Tower",
            configId: "antiTower",
            referencedFlags: 4,
            maxFlags: 10,
            instantPunishment: false,
            acceptTotal: true,
            flagValidationTime: 0,
            bestPunishment: "ban",
            behaviorBased: false,
        },
        experimental: true,
    },
    antiGameMode: {
        enabled: false,
        bannedGameMode: [1],
        returnDefault: true,
        returnGameMode: 0,
        modules: {
            id: "Game Mode",
            configId: "antiGameMode",
            referencedFlags: 0,
            maxFlags: 0,
            instantPunishment: true,
            acceptTotal: false,
            flagValidationTime: 0,
            bestPunishment: "ban",
            behaviorBased: false,
        },
    },
    antiNameSpoof: {
        enabled: true,
        modules: {
            id: "Name Spoof",
            configId: "antiNameSpoof",
            referencedFlags: 0,
            maxFlags: 0,
            instantPunishment: true,
            acceptTotal: false,
            flagValidationTime: 0,
            bestPunishment: "ban",
            behaviorBased: false,
        },
    },
    antiAutoTool: {
        enabled: false,
        modules: {
            id: "Auto Tool",
            configId: "antiAutoTool",
            referencedFlags: 10,
            maxFlags: 30,
            instantPunishment: false,
            acceptTotal: true,
            flagValidationTime: 0,
            bestPunishment: "ban",
            behaviorBased: false,
        },
        toolType: ["axe", "shovel", "pickaxe", "sword"],
        experimental: true,
    },
    antiFastBreak: {
        enabled: false,
        solidOnly: true,
        maxBPS: 1.2,
        toolLimit: 4.2,
        toolType: ["axe", "shovel", "pickaxe", "sword"],
        matchType: {
            wood: 3.9,
            stone: 5.1,
        },
        modules: {
            id: "Fast Break",
            configId: "antiFastBreak",
            referencedFlags: 4,
            maxFlags: 10,
            instantPunishment: false,
            acceptTotal: true,
            flagValidationTime: 0,
            bestPunishment: "ban",
            behaviorBased: false,
        },
        experimental: true,
    },
    antiXray: {
        enabled: false,
        notifyAt: ["diamond_ore", "ancient_debris"],
        experimental: true,
    },
    antiDisabler: {
        enabled: true,
        modules: {
            id: "Disabler",
            configId: "antiDisabler",
            referencedFlags: 0,
            maxFlags: 0,
            instantPunishment: true,
            acceptTotal: false,
            flagValidationTime: 0,
            bestPunishment: "ban",
            behaviorBased: false,
        },
    },
    antiIllegalItem: {
        enabled: false,
        checkIllegal: true,
        checkUnatural: true,
        checkGivableItem: true,
        checkEnchantment: true,
        checkEducationalItem: true,
        modules: {
            id: "Illegal Item",
            configId: "antiIllegalItem",
            referencedFlags: 0,
            maxFlags: 0,
            instantPunishment: true,
            acceptTotal: false,
            flagValidationTime: 0,
            bestPunishment: "ban",
            behaviorBased: false,
        },
    },
    antiFastUse: {
        enabled: false,
        minUseTime: 20,
        timeout: 60,
        modules: {
            id: "Fast Use",
            configId: "antiFastUse",
            referencedFlags: 4,
            maxFlags: 10,
            instantPunishment: true,
            acceptTotal: false,
            flagValidationTime: 0,
            bestPunishment: "ban",
            behaviorBased: false,
        },
    },
    antiOffhand: {
        enabled: false,
        modules: {
            id: "Offhand",
            configId: "antiOffhand",
            referencedFlags: 0,
            maxFlags: 0,
            instantPunishment: true,
            acceptTotal: false,
            flagValidationTime: 0,
            bestPunishment: "ban",
            behaviorBased: false,
        },
        doUnEquip: true,
    },
    antiBot: {
        enabled: false,
        clickSpeedThershold: 6,
        timer: 2,
        maxTry: 3,
    },
    antiNoSwing: {
        enabled: false,
        modules: {
            id: "No Swing",
            configId: "antiNoSwing",
            referencedFlags: 8,
            maxFlags: 12,
            instantPunishment: false,
            acceptTotal: true,
            flagValidationTime: 0,
            bestPunishment: "none",
            behaviorBased: false,
        },
        expermiental: true,
        timeout: 3000,
        faultToleranceTicks: 10,
    },
    antiBadpacket: {
        enabled: true,
        modules: {
            id: "Bad Packet",
            configId: "antiBadpacket",
            referencedFlags: 0,
            maxFlags: 0,
            instantPunishment: true,
            acceptTotal: false,
            flagValidationTime: 0,
            bestPunishment: "ban",
            behaviorBased: false,
        },
        faultToleranceTicks: 10,
    },
    worldBorder: {
        enabled: false,
        checkEvery: 2,
        radius: 250000,
        stopAdmin: false,
        centerX: 0,
        centerZ: 0,
        useSpawnLoc: true,
    },
    clientAuth: {
        enabled: false,
        trackTicks: 8,
        teleportHeight: 1,
        experimental: true,
    },
    banrun: {
        command: "",
        enabled: false,
    },
};

export const dynamic = {
    followUserConfig: false,
};
