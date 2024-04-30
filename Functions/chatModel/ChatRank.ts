import { Player, world } from "@minecraft/server";
import config from "../../Data/Config";

export { chatRank };

async function chatRank(player: Player, message: string) {
    let ranks: string[] | string = player.getTags().filter((rank) => rank.startsWith("rank:"));
    ranks = ranks.length > 0 ? ranks.map((rank) => `§r§7${rank.slice(5)}§r`) : [(world.getDynamicProperty("defaultRank") as string) ?? config.chatRank.defaultRank];
    ranks = config.chatRank.showAllRank ? ranks.join(" §8| ") : ranks[0];

    world.sendMessage(`§8§l<§r${ranks}§8§l>§r§f ${player.name} §c»§r§7 ${message}`);
}
