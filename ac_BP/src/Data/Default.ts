/**
 * @author Matrix Team
 * @description Default preset for AntiCheat
 * @warning NEVER CHANGE THIS FILE IF YOU DON'T KNOW WHAT YOU ARE DOING
 */
export default {
    configDataBase: {
        enabled: true,
        autorecover: true,
        confuse: 100,
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
    otherPrefix: [],
    spawnFinishDelay: 1200,
    expectedErrorShown: false,
    // Set the true will let player with tag matrix:movementCheckBypassTag for bypass some of the movement check.
    enableMovementCheckBypassTag: false,
    commands: {
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
        op: {
            enabled: true,
            adminOnly: false,
            requireTag: [],
            requireOp: true,
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
        }
    },
    ui: {
        
    },
    autoPunishment: {
        bypasslist: [],
        bypassname: [],
        observationMode: false,
        silentMode: false,
        kick: {
            reason: "Unfair advantage",
        },
        ban: {
            minutes: 1440,
            reason: "Unfair advantage",
        },
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
    dimensionLock: {
        enabled: false,
    },
    antiAutoClicker: {
        enabled: true,
        maxClicksPerSecond: 24,
        timeout: 200,
        minInterval: 35,
        punishment: "tempkick",
        maxVL: 2,
    },
    antiKillAura: {
        enabled: true,
        minAngle: 160,
        timeout: 200,
        maxEntityHit: 2,
        punishment: "ban",
        maxVL: 4,
        // For Anti KillAura Type K
        trackLength: 10,
        maxIncreasingCombos: 7,
        minIncreasingCombos: 3,
        silentData: false,
    },
    antiAura: {
        enabled: true,
        minHitRequired: 3,
        spawnHeightOffset: 1.8,
        spawnRadius: 2.5,
        comboTime: 15000,
        maxVL: 5,
        punishment: "ban",
    },
    antiReach: {
        enabled: true,
        maxReach: 4.21,
        maxYReach: 4.8,
        punishment: "ban",
        maxVL: 3,
    },
    antiFly: {
        enabled: true,
        punishment: "tempkick",
        highVelocity: 0.7,
        maxGroundPrviousVelocity: 0.5,
        maxHighVelocity: 22,
        maxVL: 4,
    },
    antiNoFall: {
        enabled: true,
        punishment: "ban",
        float: 15,
        maxVL: 3,
    },
    antiNoClip: {
        enabled: true,
        punishment: "ban",
        clipMove: 1.6,
        maxVL: 4,
        minMoveDistance: 196, // 12 cunks distance
        tickMovementCooldown: 7000,
    },
    antiSpeed: {
        enabled: true,
        punishment: "ban",
        maxVL: 4,
        commonThreshold: 0.7,
        inSolidThreshold: 1.3,
        damageThreshold: 3,
        validFlagDuration: 32000,
        maxFlagInDuration: 3,
        flagDurationIncrase: 5000,
        allowSpeedLevels: {
            moving: 15,
            sprinting: 8,
            usingItem: 4,
        },
        absThreshould: 1,
    },
    antiTimer: {
        enabled: true,
        punishment: "tempkick",
        maxVL: 5,
        minTimerLog: 3,
        maxTickMovment: 196, // 12 cunks distance
        tickMovementCooldown: 8000,
    },
    antiNuker: {
        enabled: true,
        maxBreakPerTick: 6,
        timeout: 100,
        punishment: "ban",
        solidOnly: true,
        maxVL: 0,
    },
    antiScaffold: {
        enabled: true,
        timeout: 20,
        maxAngle: 175,
        factor: 1,
        minRotation: 20,
        maxBPS: 5,
        punishment: "kick",
        maxVL: 4,
    },
    antiNoSlow: {
        enabled: true,
        maxWebSpeed: 0.85,
        maxItemSpeed: 0.2,
        itemUseTime: 350,
        timeout: 60,
        punishment: "ban",
        maxVL: 4,
    },
    antiBreaker: {
        enabled: false,
        timeout: 60,
        writeList: ["minecraft:cake", "minecraft:dragon_egg"],
        punishment: "ban",
        maxVL: 4,
        experimental: true,
    },
    antiSpammer: {
        enabled: true,
        punishment: "ban",
        maxVL: 0,
    },
    antiBlockReach: {
        enabled: false,
        maxPlaceDistance: 8,
        maxBreakDistance: 8,
        timeout: 60,
        punishment: "ban",
        maxVL: 0,
    },
    antiAim: {
        enabled: false,
        experimental: true,
        punishment: "none",
        maxVL: 12,
    },
    antiTower: {
        enabled: true,
        minDelay: 200,
        timeout: 60,
        punishment: "tempkick",
        maxVL: 2,
        experimental: true,
    },
    antiGameMode: {
        enabled: false,
        bannedGameMode: [1],
        returnDefault: true,
        returnGameMode: 0,
        punishment: "ban",
        maxVL: 4,
    },
    antiNameSpoof: {
        enabled: true,
        punishment: "ban",
    },
    antiAutoTool: {
        enabled: false,
        punishment: "tempkick",
        maxVL: 4,
        toolType: ["axe", "shovel", "pickaxe", "sword"],
        experimental: true,
    },
    antiFastBreak: {
        enabled: false,
        punishment: "tempkick",
        maxVL: 4,
        solidOnly: true,
        maxBPS: 1.2,
        toolLimit: 4.2,
        toolType: ["axe", "shovel", "pickaxe", "sword"],
        matchType: {
            wood: 3.9,
            stone: 5.1,
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
        maxVL: 0,
        punishment: "ban",
    },
    antiIllegalItem: {
        enabled: false,
        punishment: "ban",
        maxVL: 0,
        checkIllegal: true,
        checkUnatural: true,
        checkGivableItem: true,
        checkEnchantment: true,
        checkEducationalItem: true,
    },
    antiElytraFly: {
        enabled: true,
        maxVL: 4,
        fallDiscycle: 4,
        maxFallDis: 1.05,
        maxRatio: 10,
        punishment: "tempkick",
        experimental: true,
    },
    antiFastUse: {
        enabled: true,
        minUseTime: 20,
        timeout: 60,
        punishment: "ban",
        maxVL: 2,
    },
    antiOffhand: {
        enabled: true,
        punishment: "ban",
        maxVL: 0,
        doUnEquip: true,
    },
    antiBot: {
        enabled: false,
        punishment: "ban",
        maxVL: 0,
        clickSpeedThershold: 6,
        timer: 2,
        maxTry: 3,
    },
    antiNoSwing: {
        enabled: true,
        punishment: "tempkick",
        maxVL: 7,
        timeout: 3000,
        faultToleranceTicks: 10,
    },
    antiBadpacket: {
        enabled: true,
        punishment: "ban",
        maxVL: 4,
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
    },
    banrun: {
        command: "",
        enabled: false,
    },
};

export const dynamic = {
    followUserConfig: false,
};
