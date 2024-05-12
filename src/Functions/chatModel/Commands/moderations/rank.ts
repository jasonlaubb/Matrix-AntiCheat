import { registerCommand, isPlayer, verifier, sendRawText } from "../../CommandHandler";
import { c } from "../../../../Assets/Util";

registerCommand ({
    name: "rank",
    description: "The rank related commands",
    parent: true,
    require: (player) => verifier (player, c().commands.rank)
}, {
    name: "set",
    description: "Set the rank of a player",
    minArgs: 2,
    maxArgs: 2,
    argRequire: [
        (value) => !!isPlayer(value as string),
    ],
    executor: async (player, args) => {
        const target = isPlayer(args[0])
        const ranks = target.getTags().filter((rank) => rank.startsWith("rank:"))
        ranks.forEach((rank) => target.removeTag(rank))
        target.addTag(`rank:${args[1]}`)
        sendRawText (player, 
            { text: "§bMatrix §7>§g " },
            { translate: "rank.hasset", with: [target.name, args[1]] },
        )
    }
}, {
    name: "add",
    description: "Add a new rank to a player",
    minArgs: 2,
    maxArgs: 2,
    argRequire: [
        (value) => !!isPlayer(value as string),
    ],
    executor: async (player, args) => {
        const target = isPlayer(args[0])
        if (!player.hasTag(`rank:${args[1]}`)) {
            target.addTag(`rank:${args[1]}`)
            sendRawText (player, 
                { text: "§bMatrix §7>§g " },
                { translate: "rank.hasadd", with: [target.name, args[1]] },
            )
        } else {
            sendRawText (player, 
                { text: "§bMatrix §7>§c " },
                { translate: "rank.already", with: [target.name, args[1]] },
            )
        }
    }
}, {
    name: "remove",
    description: "Remove a cool rank from a player",
    minArgs: 2,
    maxArgs: 2,
    argRequire: [
        (value) => !!isPlayer(value as string),
    ],
    executor: async (player, args) => {
        const target = isPlayer(args[0]);
        if (target.getTags().filter((rank) => rank.startsWith("rank:")).length > 0) {
            if (target.hasTag(`rank:${args[1]}`)) {
                sendRawText (player, 
                    { text: "§bMatrix §7>§g " },
                    { translate: "rank.hasremove", with: [target.name, args[1]] },
                )
                target.removeTag(`rank:${args[1]}`);
            } else {
                sendRawText (player, 
                    { text: "§bMatrix §7>§c " },
                    { translate: "rank.norank", with: [target.name, args[1]] },
                )
            }
        } else {
            sendRawText (player, 
                { text: "§bMatrix §7>§c " },
                { translate: "rank.empty", with: [target.name] },
            )
        }
    }
})