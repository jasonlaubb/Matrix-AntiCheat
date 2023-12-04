import {
    world,
    system,
    Container,
    Player,
    ItemStack,
    ItemEnchantsComponent,
    EntityInventoryComponent,
    BlockInventoryComponent,
    EnchantmentList,
    PlayerPlaceBlockBeforeEvent
} from "@minecraft/server"
import { flag, isAdmin, isTargetGamemode, c } from "../../Assets/Util"
import { MinecraftBlockTypes, MinecraftItemTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index"
import enchantableItem from "../../Data/ItemCanEnchant"
import lang from "../../Data/Languages/lang"

/**
 * @author jasonlaubb
 * @description A powerful anti illegal item system to prevent player use illegal item
 */

//A - false positive: never, efficiency: very high
//B - false positive: never, efficiency: high
//C - false positive: never, efficiency: mid
//D - false positive: never, efficiency: very high
//E - false positive: never, efficiency: mid
//F - false positive: never, efficiency: very high
//G - false positive: never, efficiency: very high
//H - false positive: never, efficiency: high
//I - false positive: never, efficiency: low

function ItemCheck (player: Player, container: Container): "Safe" | "Unsafe" {
    const config = c()
    if (!config.antiIllegalItem.checkCreativeMode && isTargetGamemode(player, 1)) return "Safe"
    let state: "Safe" | "Unsafe" = "Safe"

    for (let i = 0; i < container.size; i++) {
        const item: ItemStack = container.getItem(i)

        if (item === undefined) continue

        if (config.antiIllegalItem.state.typeCheck.enabled && config.antiIllegalItem.illegalItem.includes(item.typeId)) {
            container.setItem(i)
            flag (player, "Illegal Item", "A", 0, config.antiIllegalItem.state.typeCheck.punishment, [lang(">Mode") + ":" + lang(">ItemType"), lang(">typeId") + ":" + item.typeId])
            state = "Unsafe"
            continue
        }

        if (config.antiIllegalItem.state.nameLength.enabled && item.nameTag && item.nameTag?.length > config.antiIllegalItem.state.nameLength.maxItemNameLength) {
            container.setItem(i)
            flag (player, "Illegal Item", "B", 0, config.antiIllegalItem.state.nameLength.punishment, [lang(">Mode") + ":" + lang(">ItemNameLength"), lang(">nameLength") + ":" + item.nameTag?.length])
            state = "Unsafe"
            continue
        }

        if (config.antiIllegalItem.state.itemTag.enabled && (item.getCanPlaceOn().length > config.antiIllegalItem.state.itemTag.maxAllowedTag || item.getCanDestroy().length > config.antiIllegalItem.state.itemTag.maxAllowedTag)) {
            container.setItem(i)
            flag (player, "Illegal Item", "C", 0, config.antiIllegalItem.state.itemTag.punishment, [lang(">Mode") + ":" + lang(">ItemTag")])
            state = "Unsafe"
            continue
        }

        if (config.antiIllegalItem.state.loreCheck.enabled) {
            const lore = item.getLore()
            if (lore.length > 0) {
                container.setItem(i)

                const loreString = lore.join(",")
                flag (player, "Illegal Item", "D", 0, config.antiIllegalItem.state.loreCheck.punishment, [lang(">Mode") + ":" + lang(">ItemLore"), lang(">ItemLore") + ":" + truncateString(loreString)])
                state = "Unsafe"
                continue
            }
        }

        if (config.antiIllegalItem.state.itemAmount.enabled && (item.amount > item.maxAmount || item.amount <= 0)) {
            container.setItem(i)
            flag (player, "Illegal Item", "E", 0, config.antiIllegalItem.state.itemAmount.punishment, [lang(">Mode") + ":" + lang(">ItemAmount"), lang(">Amount") + ":" + item.amount])
            state = "Unsafe"
            continue
        }

        const itemEnchant = item.getComponent(ItemEnchantsComponent.componentId) as ItemEnchantsComponent
        const enchantments = itemEnchant.enchantments

        if (config.antiIllegalItem.state.enchantLevel.enabled || config.antiIllegalItem.state.enchantConflict.enabled) {
            let patchedEnchantment = []
            let mode = lang(">EnchantLevel")
            let type = "F"

            //create a new EnchantmentList to check if the enchantment is conflict
            const tester = new EnchantmentList (enchantments.slot)
            for (const enchantment of enchantments) {
                if (config.antiIllegalItem.state.enchantLevel.enabled) {
                    const enchantmentType = enchantment.type
                    const enchantmentLevel = enchantment.level

                    if (config.antiIllegalItem.state.enchantLevel.whiteList.includes(enchantmentType.id + ":" + enchantmentLevel)) continue
                    if (enchantmentLevel > enchantmentType.maxLevel || enchantmentLevel <= 0) {
                        patchedEnchantment.push(enchantmentType.id + ":" + enchantmentLevel)
                    }
                }
                if (config.antiIllegalItem.state.enchantConflict.enabled) {
                    const isConflict = tester.canAddEnchantment(enchantment)
                    if (isConflict === false) {
                        patchedEnchantment.push(enchantment.type.id + ":" + enchantment.level)
                        mode = lang(">EnchantConflict")
                        type = "G"
                    } else {
                        tester.addEnchantment(enchantment)
                    }
                }
            }
            if (patchedEnchantment.length > 0) {
                flag (player, "Illegal Item", type,0, config.antiIllegalItem.state.enchantLevel.punishment, [lang(">Mode") + ":" + mode, ...patchedEnchantment])
                state = "Unsafe"
                container.setItem(i)
                continue
            }
        }

        if (config.antiIllegalItem.state.enchantAble.enabled && [...enchantments].length > 0 && !enchantableItem.includes(item.typeId as MinecraftItemTypes) && !config.antiIllegalItem.state.enchantAble.whiteList.includes(item.typeId)) {
            container.setItem(i)
            flag (player, "Illegal Item", "H", 0, config.antiIllegalItem.state.enchantAble.punishment, [lang(">Mode") + ":" + lang(">ItemEnchantAble"), lang(">typeId") + item.typeId])
            state = "Unsafe"
            continue
        }

        if (config.antiIllegalItem.state.enchantRepeat.enabled && new Set([...enchantments]).size < [...enchantments].length) {
            container.setItem(i)
            flag (player, "Illegal Item", "I", 0, config.antiIllegalItem.state.enchantRepeat.punishment, [lang(">Mode") + ":" + lang(">ItemEnchantRepeat")])
            state = "Unsafe"
            continue
        }
    }

    return state
}

const illegalItemA = () => {
    const players = world.getAllPlayers()
    for (const player of players) {
        if (isAdmin(player)) continue

        const container: Container = (player.getComponent(EntityInventoryComponent.componentId) as EntityInventoryComponent).container
        ItemCheck (player, container)
    }
}

const illegalItemB = (event: PlayerPlaceBlockBeforeEvent) => {
    const config = c()
    const { player, block } = event

    if (isAdmin(player) || player.hasTag("matrix:place-disabled")) return

    const container: Container = (block.getComponent(BlockInventoryComponent.componentId) as BlockInventoryComponent)?.container
    if (container.size === 0) return;

    const checkingState = ItemCheck (player, container)

    if (checkingState === "Unsafe") {
        block.setType(MinecraftBlockTypes.Air)
        player.addTag("matrix:place-disabled")
        system.runTimeout(() => player.removeTag("matrix:place-disabled"), config.antiIllegalItem.timeout)
    }
}

function truncateString(str: string) {
    if (str.length <= 8) {
        return str;
    } else {
        return str.slice(0, 8) + "...";
    }
}

let id: number
export default {
    enable () {
        id = system.runInterval(illegalItemA)
        world.beforeEvents.playerPlaceBlock.subscribe(illegalItemB)
    },
    disable () {
        system.clearRun(id)
        world.beforeEvents.playerPlaceBlock.subscribe(illegalItemB)
    }
}
