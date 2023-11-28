/**
 * @author Matrix Team
 * @description The config json of the AntiCheat
 * 
 * @warning
 * The setting of config maybe changed in dynamic properties (change config will not effect the server)
 */

export default {
    /** 
     * @description
     * The setting for our functions
     */
    language: "en_US",
    flagMode: "tag",
    lockdowncode: "AbCdEfGh",
    passwordCold: 5000,
    slient: false, // No action. This will cause spam message in some Modules
    commands: {
        password: "password", // The password for op command
        prefix: "-", // The prefix of commands
        example: {
            enabled: true, // true mearns the example command will be enabled, false means the example command will be disabled
            adminOnly: true, // true means only admin can use the command, false means everyone can use the command
            requireTag: ["mod","manager"] // The tag that the player must have 1 of the tag to use the command, "none" means no tag is required
        },
        help: {
            enabled: true,
            adminOnly: true,
            requireTag: "none"
        },
        toggles: {
            enabled: true,
            adminOnly: true,
            requireTag: "none"
        },
        toggle: {
            enabled: true,
            adminOnly: true,
            requireTag: "none"
        },
        op: {
            enabled: true,
            adminOnly: false,
            requireTag: "none"
        },
        deop: {
            enabled: true,
            adminOnly: true,
            requireTag: "none"
        },
        passwords: {
            enabled: true,
            adminOnly: true,
            requireTag: "none"
        },
        flagmode: {
            enabled: true,
            adminOnly: true,
            requireTag: "none"
        },
        rank: {
            enabled: true,
            adminOnly: true,
            requireTag: "none"
        },
        rankclear: {
            enabled: true,
            adminOnly: true,
            requireTag: "none"
        },
        defaultrank: {
            enabled: true,
            adminOnly: true,
            requireTag: "none"
        },
        showallrank: {
            enabled: true,
            adminOnly: true,
            requireTag: "none"
        },
        ban: {
            enabled: true,
            adminOnly: true,
            requireTag: "none"
        },
        unban: {
            enabled: true,
            adminOnly: true,
            requireTag: "none"
        },
        unbanremove: {
            enabled: true,
            adminOnly: true,
            requireTag: "none"
        },
        unbanlist: {
            enabled: true,
            adminOnly: true,
            requireTag: "none"
        },
        freeze: {
            enabled: true,
            adminOnly: true,
            requireTag: "none"
        },
        unfreeze: {
            enabled: true,
            adminOnly: true,
            requireTag: "none"
        },
        mute: {
            enabled: true,
            adminOnly: true,
            requireTag: "none"
        },
        unmute: {
            enabled: true,
            adminOnly: true,
            requireTag: "none"
        },
        vanish: {
            enabled: true,
            adminOnly: true,
            requireTag: "none"
        },
        unvanish: {
            enabled: true,
            adminOnly: true,
            requireTag: "none"
        },
        invcopy: {
            enabled: true,
            adminOnly: true,
            requireTag: "none"
        },
        invsee: {
            enabled: true,
            adminOnly: true,
            requireTag: "none"
        },
        echestwipe: {
            enabled: true,
            adminOnly: true,
            requireTag: "none"
        },
        lockdowncode: {
            enabled: true,
            adminOnly: true,
            requireTag: "none"
        },
        lockdown: {
            enabled: true,
            adminOnly: true,
            requireTag: "none"
        },
        unlock: {
            enabled: true,
            adminOnly: true,
            requireTag: "none"
        },
        adminchat: {
            enabled: true,
            adminOnly: true,
            requireTag: "none"
        },
        lang: {
            enabled: true,
            adminOnly: true,
            requireTag: "none"
        },
        langlist: {
            enabled: true,
            adminOnly: true,
            requireTag: "none"
        }
    },
    /** 
     * @description
     * The config of all modules
    */
    punishment_kick: {
        reason: "Unfair advantage"
    },
    punishment_ban: {
        minutes: 30,
        reason: "Unfair advantage"
    },
    example_anticheat_module: {
        enabled: true, // true mearns the module will be enabled, false means the module will be disabled
        punishment: "ban" // The punishment of the module, "none" means no punishment
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
        maxClicksPerSecond: 22,
        timeout: 200,
        punishment: "kick",
        maxVL: 4
    },

    antiKillAura: {
        enabled: true,
        minAngle: 120,
        timeout: 200,
        maxEntityHit: 1,
        punishment: "kick",
        maxVL: 4
    },

    antiReach: {
        enabled: true,
        maxReach: 3.7,
        maxYReach: 4.8,
        punishment: "kick",
        maxVL: 2
    },

    antiFly: {
        enabled: true,
        flyY: 0.7,
        flyXZ: 0.7,
        maxFlyY: 3.5,
        fallXZ: 0.15,
        punishment: "none",
        maxVL: 4
    },

    antiMotion: {
        enabled: true,
        minRelativeY: 0.4,
        fallingDuration: 5,
        punishment: "kick",
        maxVL: 4
    },

    antiPhase: {
        enabled: true,
        punishment: "kick",
        maxVL: 10
    },

    antiSpeed: {
        enabled: true,
        mphThreshold: 150,
        punishment: "kick",
        maxVL: 4
    },

    antiNuker: {
        enabled: true,
        maxBreakPerTick: 5,
        timeout: 100,
        punishment: "kick",
        maxVL: 0
    },

    antiScaffold: {
        enabled: true,
        timeout: 20,
        maxAngle: 95,
        factor: 1,
        minRotation: 34.98,
        maxBPS: 6,
        punishment: "kick",
        maxVL: 2
    },

    antiNoSlow: {
        enabled: true,
        maxSpeedTherehold: 0.04,
        maxUsingItemTherehold: 0.1618875,
        itemUseTime: 250,
        maxNoSlowBuff: 1,
        timeout: 60,
        punishment: "kick",
        maxVL: 4
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
        punishment: "kick",
        maxVL: 2
    },

    antiBlockReach: {
        enabled: true,
        maxPlaceDistance: 6.9,
        maxBreakDistance: 6.85,
        timeout: 60,
        punishment: "kick",
        maxVL: 0,
    },

    antiAim: {
        enabled: true,
        maxRotSpeed: 15,
        timeout: 50,
        punishment: "kick",
        maxVL: 10
    },

    antiTower: {
        enabled: true,
        minDelay: 200,
        timeout: 60,
        punishment: "kick",
        maxVL: 2
    },

    antiGameMode: {
        enabled: false,
        bannedGameMode: [1], //example [1,3] creative mode and spectator mode will be punished
        returnDefault: true, // if true, player will be return to default game mode
        returnGameMode: 0, // use when returnDefault is false
        punishment: "kick",
        maxVL: 2
    },

    antiNameSpoof: {
        enabled: true,
        punishment: "kick"
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
                punishment: "kick"
            },
            nameLength: {
                enabled: true,
                punishment: "none",
                maxItemNameLength: 32
            },
            itemTag: {
                enabled: true,
                punishment: "kick",
                maxAllowedTag: 0
            },
            loreCheck: {
                enabled: true,
                punishment: "kick"
            },
            itemAmount: {
                enabled: true,
                punishment: "kick"
            },
            enchantLevel: {
                enabled: true,
                punishment: "kick",
                whiteList: [], //example: ["knockback:4"] than knockback enchantment with level 4 will not be punished

            },
            enchantConflict: {
                enabled: true,
                punishment: "kick",
                whitList: [], //example: ["mending","infinity"] than mending and infinity will not be punished
            },
            enchantAble: {
                enabled: true,
                punishment: "kick",
                whiteList: [], //example: ["superItem:super_sword"] for bypass super_word's enchantment

            },
            enchantRepeat: {
                enabled: true,
                punishment: "kick"
            }
        },
        checkCreativeMode: true,
        timeout: 60
    },

    antiSurrond: {
        enabled: true,
        maxBlocksPer2Tick: 4,
        timeout: 100,
        punishment: "kick",
        maxVL: 1
    },

    antiMovement: {
        enabled: true,
        maxDifferent: 0.1,
        maxHorizontalVelocity: 1,
        maxVL: 1,
        punishment: "kick"
    },

    antiTimer: {
        enabled: true,
        punishment: "kick",
        absError: 1.05,
        maxVL: 7,
    },

    antiBlink: {
        enabled: false,
        punishment: "kick",
        maxVL: 7
    },

    antiFastUse: {
        enabled: true,
        minUseTime: 20,
        timeout: 60,
        punishment: "kick",
        maxVL: 4
    },

    antiAuto: {
        enabled: true,
        punishment: "kick",
        maxVL: 4
    },

    antiOperator: {
        enabled: false, // this thing can't work on Realm
        punishment: "none"
    },

    antiCommandBlockExplolit: {
        enabled: false,
        punishment: "kick",
        maxVL: 4
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
        "https://",
        "http://",
        "the best minecraft bedrock utility mod",
        "horion",
        "disepi/ambrosial"
    ]
}