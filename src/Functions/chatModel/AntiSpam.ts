import { Player, system } from "@minecraft/server";
import ChatFilterData from "../../Data/ChatFilterData";
import Dynamic from "../Config/dynamic_config";
const special_characters = {
    "0": "o",
    "1": "i",
    "3": "e",
    "4": "a",
    "5": "s",
    "6": "g",
    "7": "t",
    "8": "b",
    "@": "a",
    "€": "e",
};
export function intergradedAntiSpam(player: Player, message: string) {
    const config = Dynamic.config();
}

/*
let ascendingorder = ChatFilterData;

for (let x = 0; x < ascendingorder.length; x++) {
    for (let y = 0; y < ascendingorder.length; y++) {
        if (ascendingorder[x] < ascendingorder[y]) {
            ascendingorder = reverseLoc(ascendingorder, x, y);
        }
    }
}

function reverseLoc (target: string[], index1: number, index2: number) {
    const newindex2 = target[index1]
    const newindex1 = target[index2]
    target[index1] = newindex1
    target[index2] = newindex2
    return target;
}*/
const filterRegex = new RegExp(ChatFilterData.join("|"), "g");
function chatFilter(player: Player, message: string) {
    let msg = message.latinise().toLowerCase();
    Object.entries(special_characters).forEach(([key, value]) => {
        msg = msg.replaceAll(key, value);
    });
    if (filterRegex.test(msg)) {
        system.run(() => {
            player.sendMessage(`Nonononono`);
        });
        return true;
    }
}
