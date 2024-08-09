import { system, world } from "@minecraft/server";
import { c } from "../../Assets/Util";
import Index from "../../index";
import { getChangers } from "./dynamic_config";
import { Base64 } from "../../node_modules/@i-xi-dev/base64/esm/src/base64"

let trueDBId: string;
export function dataBaseInitialize () {
    const config = c().configDataBase;
    const mark = config.mark;
    const allDB = world.scoreboard.getObjectives().filter((objective) => objective?.displayName === mark);
    let property: string;
    if (!Index.initialized) return;
    if (allDB.length > 0) {
        const trueDB = allDB.find((objective) => objective.getScore(objective.getParticipants()[0]!.displayName)! == 1);
        if (!trueDB) {
            world.sendMessage(`§bMatrix §7>§c DataBase has been lost due to unknown reason.`);
        } else {
            property = trueDB.getParticipants()[0].displayName;
            trueDBId = trueDB.id;
        }
    } else {
        const name = "matrix:" + randomString(config.hashlength);
        allDB.forEach(({ id }) => {
            world.scoreboard.removeObjective(id);
        })
        const newObj = world.scoreboard.addObjective(name, mark);
        const stringGiven = Base64.encode(toUinit8Array(getChangers()));
        newObj.setScore(stringGiven, 1);
    }
    // Generate fake people
    system.runJob(confuseGenerator(config.confuse, mark));
}

function randomString (length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// Generate something that is confuse!
function* confuseGenerator (confuse: number, mark: string) {
    // Random generate some fake things
    if (confuse > 0) {
        for (let i = 0; i < confuse; i++) {
            const newObj = world.scoreboard.addObjective("matrix:" + randomString(32), mark);
            newObj.setScore(randomString(32), 0);
            yield;
        }
    }
}

function toUinit8Array (text: string) {
    return Uint8Array.from(Array.from(text).map(letter => letter.charCodeAt(0)));
}

system.runInterval(() => {

}, 20)