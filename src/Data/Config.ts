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
    createScoreboard: true, //create betaAPI scoreboard on boot
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
            requireTag: ["mod", "manager"], // The tag that the player must have 1 of the tag to use the command, [] means no tag is required
        },
        help: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
        },
        toggles: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
        },
        toggle: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
        },
        op: {
            enabled: true,
            adminOnly: false,
            requireTag: [],
        },
        deop: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
        },
        passwords: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
        },
        flagmode: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
        },
        rank: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
        },
        rankclear: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
        },
        defaultrank: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
        },
        showallrank: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
        },
        ban: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
        },
        unban: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
        },
        unbanremove: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
        },
        unbanlist: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
        },
        freeze: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
        },
        unfreeze: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
        },
        mute: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
        },
        unmute: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
        },
        vanish: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
        },
        unvanish: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
        },
        invcopy: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
        },
        invsee: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
        },
        echestwipe: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
        },
        lockdowncode: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
        },
        lockdown: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
        },
        unlock: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
        },
        adminchat: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
        },
        lang: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
        },
        langlist: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
        },
        borderSize: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
        },
        matrixui: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
        },
        banrun: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
        },
        openLog: {
            enabled: true,
            adminOnly: true,
            requireTag: [],
        },
    },
    /**
     * @description
     * The config of all modules
     */
    punishment_kick: {
        reason: "Bad behavior",
    },
    punishment_ban: {
        minutes: 1440,
        reason: "Unfair advantage",
    },
    example_anticheat_module: {
        enabled: true, // true mearns the module will be enabled, false means the module will be disabled
        punishment: "ban", // The punishment of the module, [] means no punishment
        //punishmentType: "ban", "kick"
    },
    chatRank: {
        enabled: true,
        defaultRank: "§pMember",
        showAllRank: true,
    },
    dimensionLock: {
        enabled: false,
    },
    logsettings: {
        utc: 0, // How anticheat display the time in UTC
        maxStorge: 200,
        pageShows: 20,
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
        mphThreshold: 150,
        bpsThershold: 11.5,
        clipThershold: 7,
        punishment: "kick",
        maxVL: 4,
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
        maxWebSpeed: 0.85, // huh
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

    antiSpam: {
        enabled: true,
        maxMessagesPerSecond: 3,
        timer: 500,
        maxCharacterLimit: 200,
        kickThreshold: 3,
        timeout: 200,
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
        enabled: false,
        maxRotSpeed: 15,
        timeout: 50,
        punishment: "none",
        experimental: true,
        maxVL: 4,
    },

    antiTower: {
        enabled: true,
        minDelay: 200,
        timeout: 60,
        punishment: "none",
        maxVL: 2,
    },

    antiGameMode: {
        enabled: false,
        bannedGameMode: [1], //example [1,3] creative mode and spectator mode will be punished
        returnDefault: true, // if true, player will be return to default game mode
        returnGameMode: 0, // use when returnDefault is false
        punishment: "ban",
        maxVL: 4,
    },

    antiNameSpoof: {
        enabled: true,
        punishment: "ban",
        // nothing to give you set :doge:
    },

    antiAutoTool: {
        enabled: false, //unstable module >A<
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
            //edit the tool type and it's break limit here
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
        enabled: true, // THIS SHOULD BE ENABLED
        maxVL: 0,
        punishment: "ban",
    },

    antiIllegalItem: {
        enabled: false,
        illegalItem: [
            "minecraft:unknown",
            "minecraft:reserved",
            "minecraft:command_block",
            "minecraft:chain_command_block",
            "minecraft:repeating_command_block",
            "minecraft:jigsaw",
            "minecraft:agent_spawn_egg",
            "minecraft:lingering_potion",
            "minecraft:barrier",
            "minecraft:border_block",
            "minecraft:structure_block",
            "minecraft:structure_void",
            "minecraft:deny",
            "minecraft:writable_book",
            "minecraft:allow",
            "minecraft:light_block",
            "minecraft:command_block_minecraft",
            "minecraft:spawn_egg",
            "minecraft:movingblock",
            "minecraft:movingBlock",
            "minecraft:info_update",
            "minecraft:info_update2",
            "minecraft:invisiblebedrock",
            "minecraft:end_portal_frame",
            "minecraft:infested_deepslate",
            "minecraft:budding_amethyst",
            "minecraft:chemistry_table",
            "minecraft:frosted_ice",
            "minecraft:flowing_water",
            "minecraft:water",
            "minecraft:flowing_lava",
            "minecraft:lava",
            "minecraft:fire",
            "minecraft:lit_furnace",
            "minecraft:standing_sign",
            "minecraft:wall_sign",
            "minecraft:lit_redstone_ore",
            "minecraft:unlit_redstone_ore",
            "minecraft:portal",
            "minecraft:unpowered_repeater",
            "minecraft:powered_repeater",
            "minecraft:pumpkin_stem",
            "minecraft:melon_stem",
            "minecraft:end_portal",
            "minecraft:lit_redstone_lamp",
            "minecraft:unpowered_comparator",
            "minecraft:powered_comparator",
            "minecraft:double_wooden_slab",
            "minecraft:standing_banner",
            "minecraft:wall_banner",
            "minecraft:daylight_detector_inverted",
            "minecraft:chemical_heat",
            "minecraft:underwater_torch",
            "minecraft:end_gateway",
            "minecraft:stonecutter",
            "minecraft:glowingobsidian",
            "minecraft:netherreactor",
            "minecraft:bubble_column",
            "minecraft:bamboo_sapling",
            "minecraft:spruce_standing_sign",
            "minecraft:spruce_wall_sign",
            "minecraft:birch_standing_sign",
            "minecraft:birch_wall_sign",
            "minecraft:jungle_standing_sign",
            "minecraft:jungle_wall_sign",
            "minecraft:acacia_standing_sign",
            "minecraft:acacia_wall_sign",
            "minecraft:darkoak_standing_sign",
            "minecraft:darkoak_wall_sign",
            "minecraft:lit_smoker",
            "minecraft:lava_cauldron",
            "minecraft:soul_fire",
            "minecraft:crimson_standing_sign",
            "minecraft:crimson_wall_sign",
            "minecraft:warped_standing_sign",
            "minecraft:warped_wall_sign",
            "minecraft:blackstone_double_slab",
            "minecraft:polished_blackstone_double_slab",
            "minecraft:polished_blackstone_brick_double_slab",
            "minecraft:Unknown",
            "minecraft:camera",
            "minecraft:lit_deepslate_redstone_ore",
            "minecraft:hard_stained_glass",
            "minecraft:colored_torch_rg",
            "minecraft:colored_torch_bp",
            "minecraft:balloon",
            "minecraft:ice_bomb",
            "minecraft:medicine",
            "minecraft:sparkler",
            "minecraft:glow_stick",
            "minecraft:compound",
            "minecraft:powder_snow",
            "minecraft:lit_blast_furnace",
            "minecraft:redstone_wire",
            "minecraft:crimson_double_slab",
            "minecraft:warped_double_slab",
            "minecraft:cobbled_deepslate_double_slab",
            "minecraft:polished_deepslate_double_slab",
            "minecraft:deepslate_tile_double_slab",
            "minecraft:deepslate_brick_double_slab",
            "minecraft:agent_spawn_egg",
            "minecraft:client_request_place",
            "minecraft:rapid_fertilizer",
            "minecraft:hard_glass",
            "minecraft:hard_glass_pane",
            "minecraft:exposed_double_cut_copper_slab",
            "minecraft:oxidized_double_cut_copper_slab",
            "minecraft:waxed_double_cut_copper_slab",
            "minecraft:waxed_exposed_double_cut_copper_slab",
            "minecraft:waxed_oxidized_double_cut_copper_slab",
            "minecraft:waxed_weathered_double_cut_copper_slab",
            "minecraft:weathered_double_cut_copper_slab",
            "minecraft:double_wooden_slab",
            "minecraft:double_cut_copper_slab",
            "minecraft:invisible_bedrock",
            "minecraft:piston_arm_collision",
            "minecraft:sticky_piston_arm_collision",
            "minecraft:tripwire",
            "minecraft:brewingstandblock",
            "minecraft:real_double_stone_slab",
            "minecraft:real_double_stone_slab3",
            "minecraft:real_double_stone_slab4",
            "minecraft:real_double_stone_slab2",
            "minecraft:item.acacia_door",
            "minecraft:item.bed",
            "minecraft:item.beetroot",
            "minecraft:item.birch_door",
            "minecraft:item.cake",
            "minecraft:item.campfire",
            "minecraft:item.cauldron",
            "minecraft:item.chain",
            "minecraft:item.crimson_door	",
            "minecraft:item.dark_oak_door",
            "minecraft:item.flower_pot",
            "minecraft:item.frame",
            "minecraft:item.glow_frame",
            "minecraft:item.hopper",
            "minecraft:item.iron_door",
            "minecraft:item.jungle_door",
            "minecraft:item.kelp",
            "minecraft:item.nether_sprouts",
            "minecraft:item.nether_wart",
            "minecraft:item.reeds",
            "minecraft:item.skull",
            "minecraft:item.soul_campfire",
            "minecraft:item.spruce_door",
            "minecraft:item.warped_door",
            "minecraft:item.wheat",
            "minecraft:item.wooden_door",
            "minecraft:cave_vines",
            "minecraft:cave_vines_body_with",
            "minecraft:npc_spawn_egg",
        ],
        state: {
            typeCheck: {
                enabled: true,
                punishment: "ban",
            },
            nameLength: {
                enabled: true,
                punishment: "ban",
                maxItemNameLength: 32,
            },
            itemTag: {
                enabled: true,
                punishment: "ban",
                maxAllowedTag: 0,
            },
            loreCheck: {
                enabled: true,
                punishment: "ban",
            },
            itemAmount: {
                enabled: true,
                punishment: "ban",
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
                punishment: "ban",
            },
        },
        checkCreativeMode: true,
        timeout: 60,
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
        cancelPlacement: [
            // cancel the cbe block placement
            "minecraft:bee_nest",
            "minecraft:beehive",
            "minecraft:moving_block",
            "minecraft:movingBlock",
            "minecraft:movingblock",
        ],
        cancelUsage: [
            // cancel the usage of bucket
            "minecraft:axolotl_bucket",
            "minecraft:cod_bucket",
            "minecraft:powder_snow_bucket",
            "minecraft:pufferfish_bucket",
            "minecraft:salmon_bucket",
            "minecraft:tadpole_bucket",
            "minecraft:tropical_fish_bucket",
        ],
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
        clickSpeedThershold: 6, // 1 = 1 tick or 50 mile second
        timer: 1, // 1 = 1 minute
        maxTry: 3,
    },

    worldBorder: {
        enabled: false,
        checkEvery: 2, // tick
        radius: 250000, // default radius
        stopAdmin: false,
        centerX: undefined,
        centerZ: undefined,
    },

    clientAuth: {
        enabled: false,
    },

    blacklistedMessages: ["discord.gg", "dsc.gg", "@outlook.com", "@gmail.com", "@hotmail.com", "discordapp.com", "discord.com/invite/", "https://", "http://", "the best minecraft bedrock utility mod", "disepi/ambrosial", "aras"],
    exN: 1, // change it you will have big problem. (maybe not big)
};
