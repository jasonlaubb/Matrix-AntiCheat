/**
 * @author Matrix Team
 * @description The config json of the AntiCheat
 * 
 * @warning
 * The setting of config maybe changed in dynamic properties (change config will not effect the server)
 * 
 * @docs https://transform.tools/json-to-typescript
 */

export default {
    /** 
     * @description
     * The setting for our functions
     */
    configVersion: 1, //don't change this lol
    language: "en_US",
    flagMode: "admin",
    lockdowncode: "AbCdEfGh",
    passwordCold: 5000,
    slient: false, // No action. This will cause spam message in some Modules
    otherPrefix: [],
    commands: {
        password: "password", // The password for op command
        prefix: "-", // The prefix of commands
        example: {
            enabled: true, // true mearns the example command will be enabled, false means the example command will be disabled
            adminOnly: true, // true means only admin can use the command, false means everyone can use the command
            requireTag: ["mod","manager"] // The tag that the player must have 1 of the tag to use the command, [] means no tag is required
        },
        help: {
            enabled: true,
            adminOnly: true,
            requireTag: []
        },
        toggles: {
            enabled: true,
            adminOnly: true,
            requireTag: []
        },
        toggle: {
            enabled: true,
            adminOnly: true,
            requireTag: []
        },
        op: {
            enabled: true,
            adminOnly: false,
            requireTag: []
        },
        deop: {
            enabled: true,
            adminOnly: true,
            requireTag: []
        },
        passwords: {
            enabled: true,
            adminOnly: true,
            requireTag: []
        },
        flagmode: {
            enabled: true,
            adminOnly: true,
            requireTag: []
        },
        rank: {
            enabled: true,
            adminOnly: true,
            requireTag: []
        },
        rankclear: {
            enabled: true,
            adminOnly: true,
            requireTag: []
        },
        defaultrank: {
            enabled: true,
            adminOnly: true,
            requireTag: []
        },
        showallrank: {
            enabled: true,
            adminOnly: true,
            requireTag: []
        },
        ban: {
            enabled: true,
            adminOnly: true,
            requireTag: []
        },
        unban: {
            enabled: true,
            adminOnly: true,
            requireTag: []
        },
        unbanremove: {
            enabled: true,
            adminOnly: true,
            requireTag: []
        },
        unbanlist: {
            enabled: true,
            adminOnly: true,
            requireTag: []
        },
        freeze: {
            enabled: true,
            adminOnly: true,
            requireTag: []
        },
        unfreeze: {
            enabled: true,
            adminOnly: true,
            requireTag: []
        },
        mute: {
            enabled: true,
            adminOnly: true,
            requireTag: []
        },
        unmute: {
            enabled: true,
            adminOnly: true,
            requireTag: []
        },
        vanish: {
            enabled: true,
            adminOnly: true,
            requireTag: []
        },
        unvanish: {
            enabled: true,
            adminOnly: true,
            requireTag: []
        },
        invcopy: {
            enabled: true,
            adminOnly: true,
            requireTag: []
        },
        invsee: {
            enabled: true,
            adminOnly: true,
            requireTag: []
        },
        echestwipe: {
            enabled: true,
            adminOnly: true,
            requireTag: []
        },
        lockdowncode: {
            enabled: true,
            adminOnly: true,
            requireTag: []
        },
        lockdown: {
            enabled: true,
            adminOnly: true,
            requireTag: []
        },
        unlock: {
            enabled: true,
            adminOnly: true,
            requireTag: []
        },
        adminchat: {
            enabled: true,
            adminOnly: true,
            requireTag: []
        },
        lang: {
            enabled: true,
            adminOnly: true,
            requireTag: []
        },
        langlist: {
            enabled: true,
            adminOnly: true,
            requireTag: []
        }
    },
    /** 
     * @description
     * The config of all modules
    */
    punishment_kick: {
        reason: "cheating advantage"
    },
    punishment_ban: {
        minutes: 120,
        reason: "cheating advantage"
    },
    example_anticheat_module: {
        enabled: true, // true mearns the module will be enabled, false means the module will be disabled
        punishment: "ban" // The punishment of the module, [] means no punishment
        //punishmentType: "ban", "kick"
    },
    chatRank: {
        enabled: true,
        defaultRank: "§pMember",
        showAllRank: true
    },
    dimensionLock: {
        enabled: false
    },

    antiAutoClicker: {
        enabled: true,
        maxClicksPerSecond: 24,
        timeout: 200,
        punishment: "kick",
        maxVL: 4
    },

    antiKillAura: {
        enabled: true,
        minAngle: 160,
        timeout: 200,
        maxEntityHit: 2,
        punishment: "ban",
        maxVL: 2
    },

    antiReach: {
        enabled: true,
        maxReach: 4.2,
        maxYReach: 4.8,
        punishment: "kick",
        maxVL: 4
    },

    antiFly: {
        enabled: true,
        punishment: "kick",
        maxVelocity: 0.7,
        maxVL: 4
    },

    antiNoFall: {
        enabled: true,
        punishment: "ban",
        float: 15,
        maxVL: 2
    },

    antiNoClip: {
        enabled: true,
        punishment: "ban",
        clipMove: 1.6,
        maxVL: 4
    },

    antiSpeed: {
        enabled: true,
        mphThreshold: 200,
        bpsThershold: 30.25,
        punishment: "kick",
        maxVL: 4
    },

    antiNuker: {
        enabled: true,
        maxBreakPerTick: 5,
        timeout: 100,
        punishment: "ban",
        maxVL: 0
    },

    antiScaffold: {
        enabled: true,
        timeout: 20,
        maxAngle: 175,
        factor: 1,
        minRotation: 20,
        maxBPS: 5,
        punishment: "ban",
        maxVL: 4
    },

    antiNoSlow: {
        enabled: true,
        maxSpeedTherehold: 1,
        maxUsingItemTherehold: 0.16,
        itemUseTime: 250,
        maxNoSlowBuff: 1,
        timeout: 60,
        punishment: "ban",
        maxVL: 2
    },

    antiBreaker: {
        enabled: true,
        timeout: 60,
        writeList: [
            "minecraft:cake",
            "minecraft:dragon_egg"
        ],
        punishment: "ban",
        maxVL: 2
    },

    antiSpam: {
        enabled: true,
        maxMessagesPerSecond: 3,
        timer: 500,
        maxCharacterLimit: 200,
        kickThreshold: 3,
        timeout: 200
    },

    antiSpammer: {
        enabled: true,
        punishment: "ban",
        maxVL: 2
    },

    antiBlockReach: {
        enabled: true,
        maxPlaceDistance: 8.15,
        maxBreakDistance: 8.05,
        timeout: 60,
        punishment: "ban",
        maxVL: 0,
    },

    antiAim: {
        enabled: true,
        maxRotSpeed: 15,
        timeout: 50,
        punishment: "none",
        maxVL: 4
    },

    antiTower: {
        enabled: true,
        minDelay: 200,
        timeout: 60,
        punishment: "ban",
        maxVL: 2
    },

    antiGameMode: {
        enabled: false,
        bannedGameMode: [1], //example [1,3] creative mode and spectator mode will be punished
        returnDefault: true, // if true, player will be return to default game mode
        returnGameMode: 0, // use when returnDefault is false
        punishment: "ban",
        maxVL: 4
    },

    antiNameSpoof: {
        enabled: true,
        punishment: "ban"
    },

    antiIllegalItem: {
        enabled: false,
        illegalItem: [
            "minecraft:barrier",
            "minecraft:command_block",
            "minecraft:repeating_command_block",
            "minecraft:chain_command_block",
            "minecraft:structure_block",
            "minecraft:structure_void",
            "minecraft:bedrock",
            "minecraft:end_portal_frame",
            "minecraft:end_portal",
            "minecraft:end_gateway",
            "minecraft:barrier",
            "minecraft:moving_block",
            "minecraft:invisible_bedrock",
            "minecraft:water",
            "minecraft:lava",
            "minecraft:deny",
            "minecraft:allow",
            "minecraft:border_block",
            "minecraft:light_block"
        ],
        state: {
            typeCheck: {
                enabled: true,
                punishment: "ban"
            },
            nameLength: {
                enabled: true,
                punishment: "ban",
                maxItemNameLength: 32
            },
            itemTag: {
                enabled: true,
                punishment: "ban",
                maxAllowedTag: 0
            },
            loreCheck: {
                enabled: true,
                punishment: "ban"
            },
            itemAmount: {
                enabled: true,
                punishment: "ban"
            },
            enchantLevel: {
                enabled: true,
                punishment: "ban",
                whiteList: [], //example: ["knockback:4"] than knockback enchantment with level 4 will not be punished

            },
            enchantConflict: {
                enabled: true,
                punishment: "ban",
                whitList: [], //example: ["mending","infinity"] than mending and infinity will not be punished
            },
            enchantAble: {
                enabled: true,
                punishment: "ban",
                whiteList: [], //example: ["superItem:super_sword"] for bypass super_word's enchantment

            },
            enchantRepeat: {
                enabled: true,
                punishment: "ban"
            }
        },
        checkCreativeMode: true,
        timeout: 60
    },

    antiElytraFly: {
        enabled: true,
        maxVL: 0,
        fallDiscycle: 4,
        maxFallDis: 1.05,
        maxRatio: 10,
        punishment: "kick"
    },

    antiFastUse: {
        enabled: true,
        minUseTime: 20,
        timeout: 60,
        punishment: "ban",
        maxVL: 2
    },

    antiAuto: {
        enabled: true,
        punishment: "ban",
        maxVL: 2
    },

    antiCommandBlockExplolit: {
        enabled: false,
        punishment: "kick",
        maxVL: 4
    },

    antiCrasher: {
        enabled: true,
        punishment: "ban",
        maxVL: 0
    },
    antiBot: {
        enabled: false,
        punishment: "ban",
        maxVL: 0,
        clickSpeedThershold: 2, // 1 = 1 tick or 50 mile second
        timer: 1, // 1 = 1 minute
        maxTry: 3
    },
    chatFilter: [
        "niger",
        "nigers",
        "gay",
        "stupid",
        "dumb",
        "noob"
    ],

    blacklistedMessages: [
        "discord.gg",
        "dsc.gg",
        "@outlook.com",
        "@gmail.com",
        "@hotmail.com",
        "discordapp.com",
        "discord.com/invite/",
        "https://",
        "http://",
        "the best minecraft bedrock utility mod",
        "disepi/ambrosial"
    ]
}
