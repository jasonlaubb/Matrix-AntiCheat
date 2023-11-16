/**
 * @author ravriv & jasonlaubb & RaMiGamerDev
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
    flagMode: "tag",
    lockdowncode: "AbCdEfGh",
    commands: {
        password: "password", // The password for op command
        prefix: "-", // The prefix of commands
        example: {
            enabled: true, // true mearns the example command will be enabled, false means the example command will be disabled
            adminOnly: true, // true means only admin can use the command, false means everyone can use the command
            requireTag: ["mod","manager"] // The tag that the player must have 1 of the tag to use the command, undefined means no tag is required
        },
        help: {
            enabled: true,
            adminOnly: true,
            requireTag: undefined
        },
        toggles: {
            enabled: true,
            adminOnly: true,
            requireTag: undefined
        },
        toggle: {
            enabled: true,
            adminOnly: true,
            requireTag: undefined
        },
        op: {
            enabled: true,
            adminOnly: false,
            requireTag: undefined
        },
        deop: {
            enabled: true,
            adminOnly: true,
            requireTag: undefined
        },
        passwords: {
            enabled: true,
            adminOnly: true,
            requireTag: undefined
        },
        flagmode: {
            enabled: true,
            adminOnly: true,
            requireTag: undefined
        },
        rank: {
            enabled: true,
            adminOnly: true,
            requireTag: undefined
        },
        rankclear: {
            enabled: true,
            adminOnly: true,
            requireTag: undefined
        },
        defaultrank: {
            enabled: true,
            adminOnly: true,
            requireTag: undefined
        },
        showallrank: {
            enabled: true,
            adminOnly: true,
            requireTag: undefined
        },
        ban: {
            enabled: true,
            adminOnly: true,
            requireTag: undefined
        },
        unban: {
            enabled: true,
            adminOnly: true,
            requireTag: undefined
        },
        unbanremove: {
            enabled: true,
            adminOnly: true,
            requireTag: undefined
        },
        unbanlist: {
            enabled: true,
            adminOnly: true,
            requireTag: undefined
        },
        freeze: {
            enabled: true,
            adminOnly: true,
            requireTag: undefined
        },
        unfreeze: {
            enabled: true,
            adminOnly: true,
            requireTag: undefined
        },
        mute: {
            enabled: true,
            adminOnly: true,
            requireTag: undefined
        },
        unmute: {
            enabled: true,
            adminOnly: true,
            requireTag: undefined
        },
        vanish: {
            enabled: true,
            adminOnly: true,
            requireTag: undefined
        },
        unvanish: {
            enabled: true,
            adminOnly: true,
            requireTag: undefined
        },
        invcopy: {
            enabled: true,
            adminOnly: true,
            requireTag: undefined
        },
        invsee: {
            enabled: true,
            adminOnly: true,
            requireTag: undefined
        },
        echestwipe: {
            enabled: true,
            adminOnly: true,
            requireTag: undefined
        },
        lockdowncode: {
            enabled: true,
            adminOnly: true,
            requireTag: undefined
        },
        lockdown: {
            enabled: true,
            adminOnly: true,
            requireTag: undefined
        },
        unlock: {
            enabled: true,
            adminOnly: true,
            requireTag: undefined
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
        punishment: "ban" // The punishment of the module, undefined means no punishment
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
        punishment: undefined,
        maxVL: 4
    },

    antiKillAura: {
        enabled: true,
        minAngle: 120,
        timeout: 200,
        maxEntityHit: 1,
        punishment: undefined,
        maxVL: 1
    },

    antiReach: {
        enabled: true,
        maxReach: 3.7,
        maxYReach: 4.8,
        punishment: undefined,
        maxVL: 1
    },

    antiFly: {
        enabled: true,
        maxVelocityY: 0.7,
        skipCheck: 100,
        punishment: undefined,
        maxVL: 4
    },

    antiNofall: {
        enabled: true,
        punishment: undefined,
        maxVL: 4
    },

    antiPhase: {
        enabled: true,
        punishment: undefined,
        maxVL: 2
    },

    antiSpeed: {
        enabled: true,
        mphThreshold: 150,
        punishment: undefined,
        maxVL: 2
    },

    antiNuker: {
        enabled: true,
        maxBreakPerTick: 5,
        timeout: 100,
        punishment: undefined,
        maxVL: 2
    },

    antiScaffold: {
        enabled: true,
        timeout: 20,
        maxAngle: 95,
        factor: 1,
        minRotation: 34.98,
        punishment: undefined,
        maxVL: 2
    },

    antiNoSlow: {
        enabled: true,
        maxSpeedTherehold: 0.04,
        maxNoSlowBuff: 1,
        punishment: undefined,
        maxVL: 2
    },

    antiSpam: {
        enabled: true,
        maxMessagesPerSecond: 3,
        timer: 500,
        maxCharacterLimit: 200,
        kickThreshold: 3,
        timeout: 200,
        punishment: undefined,
        maxVL: 4
    },

    antiBlockReach: {
        enabled: true,
        maxPlaceDistance: 6.3,
        maxBreakDistance: 5.8,
        timeout: 60,
        punishment: undefined,
        maxVL: 2,
    },

    antiAim: {
        enabled: true,
        maxRotSpeed: 15,
        timeout: 50,
        punishment: undefined,
        maxVL: 2
    },

    antiTower: {
        enabled: true,
        minDelay: 200,
        timeout: 60,
        punishment: undefined,
        maxVL: 2
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
