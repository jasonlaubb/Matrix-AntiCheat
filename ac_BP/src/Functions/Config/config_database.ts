import { system, world } from "@minecraft/server";
import { c, rawstr } from "../../Assets/Util";
import Index from "../../index";
import { getChangers, initialize } from "./dynamic_config";
import { Base64 } from "../../node_modules/@i-xi-dev/base64/esm/src/base64"
import { toString, fromString } from "../../node_modules/uint8arrays/dist/src/index"

let trueDBId: string;
export async function dataBaseInitialize () {
    const config = c().configDataBase;
    const mark = config.mark;
    const allDB = world.scoreboard.getObjectives().filter((objective) => objective?.displayName === mark);
    if (!Index.initialized) return;
    if (allDB.length > 0) {
        const trueDB = allDB.find((objective) => objective.getScore(objective.getParticipants()[0]!.displayName)! == 1);
        if (!trueDB) {
            if (config.sendDataBaseMessage) world.sendMessage(new rawstr(true, "c").tra("db.delun").parse());
        } else {
            trueDBId = trueDB.id;
        }
    } else {
        const name = "matrix:" + randomString(config.hashlength);
        allDB.forEach(({ id }) => {
            world.scoreboard.removeObjective(id);
        })
        const newObj = world.scoreboard.addObjective(name, mark);
        const stringGiven = Base64.encode(fromString(getChangers(), 'utf8'));
        newObj.setScore(stringGiven, 1);
    }
    // Generate fake people
    system.runJob(confuseGenerator(config.confuse, mark));
    if (config.sendDataBaseMessage) world.sendMessage(new rawstr(true, "a").tra("db.gen").parse());
    const currentDataBase = world.scoreboard.getObjective(trueDBId)!;
    const currentChanger = Base64.decode(currentDataBase.getParticipants()[0].displayName);
    if (config.autorecover && getChangers() != toString(currentChanger)) {
        world.setDynamicProperty("config", toString(currentChanger, 'utf8'));
        // Reload the dynamic config
        await initialize();
        if (config.sendDataBaseMessage) world.sendMessage(new rawstr(true, "a").tra("db.suc").parse());
    }
}

export function commitChanges () {
    system.run(() => {
        const changers = getChangers();
        const currentDataBase = world.scoreboard.getObjective(trueDBId)!;
        currentDataBase.removeParticipant(currentDataBase.getParticipants()[0]);
        currentDataBase.setScore(changers, 1);
    })
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
            try {
                const newObj = world.scoreboard.addObjective("matrix:" + randomString(32), mark);
                newObj.setScore(randomString(32), 0);
                yield;
            } catch { 
                i--;
            }
        }
    }
}