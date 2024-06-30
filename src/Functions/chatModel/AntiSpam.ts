import { Player } from "@minecraft/server";
import ChatFilterData from "../../Data/ChatFilterData"
const special_characters = {
    '0': 'o',
    '1': 'i',
    '3': 'e',
    '4': 'a',
    '5': 's',
    '6': 'g',
    '7': 't',
    '8': 'b',
    '@': 'a',
    '€': 'e',
}
function intergradedAntiSpam (player: Player, message: string) {
    let indexRange = [0,0];
}

function chatFilter (player: Player, message: string) {
    let indexRange = [0,0];
    let msg = message.toLowerCase();
    Object.entries(special_characters).forEach(([key, value]) => {
        msg = msg.replaceAll(key, value);
    })
    while (indexRange[1] < message.length) {
        const currentWord = message.slice(indexRange[0], indexRange[1]);
        const possibleMatch = ChatFilterData.fi
    }
}