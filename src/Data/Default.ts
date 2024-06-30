/**
 * @author Matrix Team
 * @description Default preset for AntiCheat
 * @warning NEVER CHANGE THIS FILE IF YOU DON'T KNOW WHAT YOU ARE DOING
 */

/**
 * @param {string} AES_key
 * @description AES key for loading config
 */
export const dynamic = {
    key: "ImEZlA6w8Y9mUUNtc/kpCG4MFBn7laQ5N3DeVMPEHO6nQEIQqTlmp8tp2vOmU+GC",
    followUserConfig: false, // State if we use UserConfig or not
};

// Don't change this config!
export default {
    configVersion: 1,
    language: "en_US",
    createScoreboard: true,
    flagMode: "admin",
    lockdowncode: "AbCdEfGh",
    passwordCold: 5000,
    slient: false,
    otherPrefix: [],
    commands: {
        passwordSetting: {
            password: "password",
            hash: "",
            usingHash: false,
        },
        prefix: "-",
        example: {
            enabled: true,
            adminOnly: true,
            requireTag: ["mod", "manager"],
        },
        about: {
            enabled: true,
            adminOnly: false,
            requireTag: [],
            helper: {
                usage: "about",
                description: { text: "About Matrix AntiCheat" },
            },
        },
        help: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            helper: {
                usage: "help",
                description: { text: "Help Menu" },
            },
        },
        toggles: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            helper: {
                usage: "toggles",
                description: { text: "Toggles Menu" },
            },
        },
        toggle: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            helper: {
                usage: "toggle <module>",
                description: { text: "Toggle the module" },
            },
        },
        op: {
            enabled: true,
            adminOnly: false,
            requireTag: [],
            helper: {
                usage: "op <player name>",
                description: { text: "Give the matrix admin permission to a player" },
            },
        },
        deop: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            helper: {
                usage: "deop <player name>",
                description: { text: "Rmove the matrix admin permission from a player" },
            },
        },
        passwords: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            helper: {
                usage: "passwords <current password> <new password>",
                description: { text: "Give the matrix admin permission to a player" },
            },
        },
        flagmode: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            helper: {
                usage: "flagmode <flagmode: all/tag/bypass/admin/none>",
                description: { text: "Change the flagmode mode used for flag message in chat" },
            },
        },
        rank: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            helper: {
                usage: "rank <add/remove/set> <player> <rank>",
                description: { text: "Rank related commands" },
            },
        },
        rankclear: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            helper: {
                usage: "rankclear <player>",
                description: { text: "Clear all the ranks of a player" },
            },
        },
        defaultrank: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            helper: {
                usage: "defaultrank <rank>",
                description: { text: "Change the default rank be showed when player don't have any rank" },
            },
        },
        showallrank: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            helper: {
                usage: "showallrank <state: true/false>",
                description: { text: "State if show all rank or not" },
            },
        },
        ban: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            helper: {
                usage: "ban <player> <target> <reason> <time: forever/?d?h?m?s>",
                description: { text: "Give the matrix admin permission to a player" },
            },
        },
        unban: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            helper: {
                usage: "unban <player name>",
                description: { text: "Unban a player with their unique name" },
            },
        },
        unbanremove: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            helper: {
                usage: "unbanremove <player name>",
                description: { text: "Stop continuing unban of a player" },
            },
        },
        unbanlist: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            helper: {
                usage: "about",
                description: { text: "List the player is waiting for unban" },
            },
        },
        freeze: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            helper: {
                usage: "freeze <player>",
                description: { text: "Freeze a player" },
            },
        },
        unfreeze: {
            enabled: true,
            adminOnly: true,
            helper: {
                usage: "unfreeze <player>",
                description: { text: "Unfreeze a player" },
            },
        },
        mute: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            helper: {
                usage: "mute <player>",
                description: { text: "Mute a player" },
            },
        },
        unmute: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            helper: {
                usage: "unmute <player>",
                description: { text: "Unmute a muted player" },
            },
        },
        vanish: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            helper: {
                usage: "vanish",
                description: { text: "Vanish yourself" },
            },
        },
        unvanish: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            helper: {
                usage: "unvanish",
                description: { text: "Stop vanishing of yourself" },
            },
        },
        invcopy: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            helper: {
                usage: "invcopy <player>",
                description: { text: "Copy a player inventory to yours" },
            },
        },
        invsee: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            helper: {
                usage: "invsee <player>",
                description: { text: "View a player inventory" },
            },
        },
        echestwipe: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            helper: {
                usage: "echestwipe <player>",
                description: { text: "Wipe a player ender chest" },
            },
        },
        lockdowncode: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            helper: {
                usage: "lockdowncode <action: random/set> [code]",
                description: { text: "Change lockdown code" },
            },
        },
        lockdown: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            helper: {
                usage: "lockdown <code>",
                description: { text: "Lockdown the server" },
            },
        },
        unlock: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            helper: {
                usage: "unlock",
                description: { text: "Unlock the server from endless lockdown" },
            },
        },
        adminchat: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            helper: {
                usage: "adminchat",
                description: { text: "Switch to admin channel" },
            },
        },
        bordersize: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            helper: {
                usage: "bordersize <size>",
                description: { text: "Change boarder sizes" },
            },
        },
        matrixui: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            helper: {
                usage: "matrixui",
                description: { text: "Open the ui for matrix" },
            },
        },
        banrun: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            helper: {
                usage: "banrun <command: command/disable>",
                description: { text: "Run a command instead for a punishment" },
            },
        },
        openlog: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
            helper: {
                usage: "openlog",
                description: { text: "Open the log system" },
            },
        },
    },
    punishment_kick: {
        reason: "Bad behavior",
    },
    punishment_ban: {
        minutes: 1440,
        reason: "Unfair advantage",
    },
    example_anticheat_module: {
        enabled: true,
        punishment: "ban",
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
            maxRepeats: 3,
            maxLength: 128,
            maxMessagesInFiveSeconds: 3,
        }
    },
    dimensionLock: {
        enabled: false,
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
    antiAutoClicker: {
        enabled: true,
        maxClicksPerSecond: 24,
        timeout: 200,
        punishment: "kick",
        maxVL: 4,
    },
    antiKillAura: {
        enabled: true,
        minAngle: 160,
        timeout: 200,
        maxEntityHit: 2,
        punishment: "ban",
        maxVL: 3,
    },
    antiReach: {
        enabled: true,
        maxReach: 4.21,
        maxYReach: 4.8,
        punishment: "kick",
        maxVL: 3,
    },
    antiFly: {
        enabled: true,
        punishment: "ban",
        maxVelocity: 0.7,
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
    },
    antiSpeed: {
        enabled: true,
        punishment: "kick",
        maxVL: 4,
        minSpeedLog: 3,
    },
    antiTimer: {
        enabled: true,
        punishment: "ban",
        maxVL: 4,
        minTimerLog: 3,
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
        enabled: true,
        maxPlaceDistance: 8,
        maxBreakDistance: 8,
        timeout: 60,
        punishment: "ban",
        maxVL: 0,
    },
    antiAim: {
        enabled: true,
        punishment: "kick",
        maxVL: 4,
    },
    antiTower: {
        enabled: true,
        minDelay: 200,
        timeout: 60,
        punishment: "kick",
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
        punishment: "kick",
        maxVL: 4,
        toolType: ["axe", "shovel", "pickaxe", "sword"],
        experimental: true,
    },
    antiFastBreak: {
        enabled: false,
        punishment: "ban",
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
        checkIllegal: true, // The true illegal item.
        checkUnatural: true, // Ban extra nbt information
        checkGivableItem: true, // Ban the item which cannot get in suurival
        checkEnchantment: true, // Ban bad enchantment
        checkEducationalItem: true, // Ban educational item
    },
    antiElytraFly: {
        enabled: true,
        maxVL: 4,
        fallDiscycle: 4,
        maxFallDis: 1.05,
        maxRatio: 10,
        punishment: "kick",
        experimental: true,
    },
    antiFastUse: {
        enabled: true,
        minUseTime: 20,
        timeout: 60,
        punishment: "ban",
        maxVL: 2,
    },
    antiAuto: {
        enabled: true,
        punishment: "ban",
        maxVL: 2,
    },
    antiCommandBlockExplolit: {
        enabled: false,
        punishment: "ban",
        maxVL: 0,
        cancelPlacement: ["minecraft:bee_nest", "minecraft:beehive", "minecraft:moving_block", "minecraft:movingBlock", "minecraft:movingblock"],
        cancelUsage: ["minecraft:axolotl_bucket", "minecraft:cod_bucket", "minecraft:powder_snow_bucket", "minecraft:pufferfish_bucket", "minecraft:salmon_bucket", "minecraft:tadpole_bucket", "minecraft:tropical_fish_bucket"],
    },
    antiCrasher: {
        enabled: true,
        punishment: "ban",
        maxVL: 0,
    },
    antiBot: {
        enabled: false,
        punishment: "ban",
        maxVL: 0,
        clickSpeedThershold: 6,
        timer: 1,
        maxTry: 3,
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
        checkForTick: 5,
        punishment: "kick",
        maxVL: 0,
        tpOffset: 1,
    },
    banrun: {
        command: "",
        enabled: false,
    },
    blacklistedMessages: ["discord.gg", "dsc.gg", "@outlook.com", "@gmail.com", "@hotmail.com", "discordapp.com", "discord.com/invite/", "https://", "http://", "the best minecraft bedrock utility mod", "disepi/ambrosial", "aras"],
    exN: 1,
};
