/**
 * @author Matrix Team
 * @description The config json of the AntiCheat
 * 
 * @warning
 * The setting of config maybe changed in dynamic properties (change config will not effect the server)
 * 
 * @docs https://transform.tools/json-to-typescript
 */

import silent from "./rules/silent"
import debugger_ from "./rules/debugger"
import supervise from "./rules/supervise"
import sentinel from "./rules/sentinel"
import terminator from "./rules/terminator"

export default {
    /** 
     * @description
     * The setting for our functions
     */
    antiCheatOptions: {
        configVersion: 1, // Version of config, useless
        language: "en_US", // default language
        createScoreboard: true, // create betaAPI scoreboard on boot
        followRule: sentinel // default rule should anticheat follow
    },
    commandOptions: {
        password: "password", // The password for op command
        prefix: "-", // The prefix of commands
        otherPrefix: [],
        passwordCoolDown: 5000, // ms
    },
    commands: {
        about: true,
        borderSize: true,
        defaultrank: true,
        help: true,
        passwords: true,
        showallrank: true,
        toggle: true,
        toggles: true
    },
    rules: [
        silent,
        debugger_,
        supervise,
        sentinel,
        terminator
    ], // Export the rulesets to the anticheat
    punishment: {
        kick: {
            reason: "Bad behavior"
        },
        ban: {
            minutes: 1440,
            reason: "Unfair advantage"
        }
    },
    modules: {
    chatRank: {
        enabled: true,
        defaultRank: "§pMember",
        showAllRank: true,
        action: { type: false, duration: null },

    },
    dimensionLock: {
        enabled: false,
        action: { type: false, duration: null },
    },

    //action 0: banPVP, 1: banBlock, 2: teleport, 3: damage

    antiAutoClicker: {
        enabled: true,
        maxClicksPerSecond: 24,
        timeout: 200,
        types: ["light"],
        action: { type: 0, duration: 20 },
  
    },

    antiKillAura: {
        enabled: true,
        minAngle: 160,
        timeout: 200,
        maxEntityHit: 2,
        types: ["stable","absloute","stable","absloute"],
        action: { type: 0, duration: 20 },
        maxVL: 3
    },

    antiReach: {
        enabled: true,
        maxReach: 4.21,
        maxYReach: 4.8,
        types: ["stable"],
        action: { type: 0, duration: 40 },
        maxVL: 3
    },

    antiFly: {
        enabled: true,
        types: ["stable"],
        maxVelocity: 0.7,
        action: { type: 2, duration: 40 },
  
    },

    antiNoFall: {
        enabled: true,
        types: ["absloute"],
        action: { type: 2, duration: null },
        float: 15,
        maxVL: 3
    },

    antiNoClip: {
        enabled: true,
        types: ["stable","stable"],
        action: { type: 2, duration: null },
        clipMove: 1.6,
    },

    antiSpeed: {
        enabled: true,
        mphThreshold: 150,
        bpsThershold: 11.5,
        clipThershold: 7,
        action: { type: 2, duration: null },
        types: ["absloute"]
    },

    antiNuker: {
        enabled: true,
        maxBreakPerTick: 6,
        timeout: 100,
        types: ["absloute"],
        solidOnly: true,
        action: { type: 1, duration: 60 },

    },

    antiScaffold: {
        enabled: true,
        timeout: 20,
        maxAngle: 175,
        factor: 1,
        minRotation: 20,
        maxBPS: 5,
        action: { type: 1, duration: 20 },
        types: ["absloute","stable","stable","absloute"],
    },

    antiNoSlow: {
        enabled: true,
        maxWebSpeed: 0.85, // huh
        maxItemSpeed: 0.2,
        itemUseTime: 350,
        timeout: 60,
        action: { type: 2, duration: null },
        types: ["absloute","unstable"]
    },

    antiBreaker: {
        enabled: true,
        timeout: 60,
        writeList: [
            "minecraft:cake",
            "minecraft:dragon_egg"
        ],
        action: { type: 1, duration: 40 },
    },

    antiSpam: {
        enabled: true,
        action: { type: false, duration: null },
        maxMessagesPerSecond: 3,
        timer: 500,
        maxCharacterLimit: 200,
        kickThreshold: 3,
        timeout: 200,
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
            "disepi/ambrosial",
            "aras"
        ]
    },

    antiSpammer: {
        enabled: true,
        action: { type: 3, duration: null },
        types: ["absloute","absloute","absloute"]
    },

    antiBlockReach: {
        enabled: true,
        maxPlaceDistance: 8,
        maxBreakDistance: 8,
        timeout: 60,
        action: { type: 1, duration: 40 },
        types: ["absloute","absloute"]
    },

    antiAim: {
        enabled: true,
        maxRotSpeed: 15,
        timeout: 50,
        action: { type: 3, duration: null },
        types: ["unstable","unstable","stable","absloute"]
    },

    antiTower: {
        enabled: true,
        minDelay: 200,
        timeout: 60,
        action: { type: 1, duration: 35 },
        maxVL: 2,
        types: ["stable"]
    },

    antiGameMode: {
        enabled: false,
        bannedGameMode: [1], //example [1,3] creative mode and spectator mode will be punished
        returnDefault: true, // if true, player will be return to default game mode
        returnGameMode: 0, // use when returnDefault is false
        action: { type: false, duration: null },
        types: ["stable"]
    },

    antiNameSpoof: {
        enabled: true,
        action: { type: false, duration: null },
        types: ["absloute","absloute"]
        // nothing to give you set :doge:
    },

    antiAutoTool: {
        enabled: false, //unstable module >A<
        action: { type: 3, duration: null },
        toolType: [
            "axe",
            "shovel",
            "pickaxe",
            "sword"
        ],
        types: ["unstable"]
    },

    antiFastBreak: {
        enabled: false,
        action: { type: 1, duration: 50 },
        solidOnly: true,
        maxBPS: 1.2,
        toolLimit: 4.2,
        toolType: [
            "axe",
            "shovel",
            "pickaxe",
            "sword"
        ],
        matchType: { //edit the tool type and it's break limit here
            "wood": 3.9,
            "stone": 5.1
        },
        types: ["unstable"]
    },

    antiXray: {
        enabled: false,
        notifyAt: [
            "diamond_ore",
            "ancient_debris"
        ],
        action: { type: false, duration: null },

    },

    antiDisabler: {
        enabled: true, // THIS SHOULD BE ENABLED
        types: ["absloute"],
        action: { type: 2, duration: null },

    },
    /*
    antiIllegalItem: {
        enabled: false,
        action: { type: false, duration: null },
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
            "minecraft:npc_spawn_egg"
        ],
        state: {
            typeCheck: {
                enabled: true,
        
            },
            nameLength: {
                enabled: true,

                maxItemNameLength: 32
            },
            itemTag: {
                enabled: true,

                maxAllowedTag: 0
            },
            loreCheck: {
                enabled: true,
        
            },
            itemAmount: {
                enabled: true,
        
            },
            enchantLevel: {
                enabled: true,

                whiteList: [], //example: ["knockback:4"] than knockback enchantment with level 4 will not be punished

            },
            enchantConflict: {
                enabled: true,

                whitList: [], //example: ["mending","infinity"] than mending and infinity will not be punished
            },
            enchantAble: {
                enabled: true,
                whiteList: [], //example: ["superItem:super_sword"] for bypass super_word's enchantment

            },
            enchantRepeat: {
                enabled: true,
        
            }
        },
        checkCreativeMode: true,
        timeout: 60
    },*/

    antiElytraFly: {
        enabled: true,
        types: ["stable"],
        fallDiscycle: 4,
        maxFallDis: 1.05,
        maxRatio: 10,
        action: { type: 2, duration: null },
    },

    antiFastUse: {
        enabled: true,
        minUseTime: 20,
        types: ["absloute"],
        timeout: 60,
        action: { type: 3, duration: null },
        maxVL: 2
    },
    antiAuto: {
        enabled: true,
        action: { type: 3, duration: null },
        types: ["absloute"],
        maxVL: 2
    },
    /*
    antiCommandBlockExplolit: {
        enabled: false,
,
        action: { type: false, duration: null },

        cancelPlacement: [ // cancel the cbe block placement
            "minecraft:bee_nest",
            "minecraft:beehive",
            "minecraft:moving_block",
            "minecraft:movingBlock",
            "minecraft:movingblock",
        ],
        cancelUsage: [ // cancel the usage of bucket
            "minecraft:axolotl_bucket",
            "minecraft:cod_bucket",
            "minecraft:powder_snow_bucket",
            "minecraft:pufferfish_bucket",
            "minecraft:salmon_bucket",
            "minecraft:tadpole_bucket",
            "minecraft:tropical_fish_bucket",
        ]
    },*/
    /*
    antiCrasher: {
        enabled: true,
        action: { type: false, duration: null },
    },*/
    antiBot: {
        enabled: false,
        action: { type: false, duration: null },
        types: ["absloute","absloute"],
        clickSpeedThershold: 6, // 1 = 1 tick or 50 mile second
        timer: 1, // 1 = 1 minute
        maxTry: 3
    },

    worldBorder: {
        enabled: false,
        action: { type: false, duration: null },
        checkEvery: 2, // tick
        radius: 250000, // default radius
        stopAdmin: false,
        centerX: undefined,
        centerZ: undefined
    }
    }
}
