import { /*DisplaySlotId, */ system, world } from "@minecraft/server";
import { c, rawstr } from "../../Assets/Util";
import Index from "../../index";
import { getChangers, initialize } from "./dynamic_config";

let trueDBId: string;
export async function dataBaseInitialize() {
    const config = c().configDataBase;
    const mark = config.mark;
    const allDB = world.scoreboard.getObjectives().filter((objective) => objective?.displayName === mark);
    if (!Index.initialized) return;
    if (allDB.length > 0) {
        const trueDB = allDB.find((objective) => objective.getScore(objective.getParticipants()[0]!.displayName)! == 1);
        allDB
            .filter((objective) => objective !== trueDB)
            .forEach(({ id }) => {
                world.scoreboard.removeObjective(id);
            });
        /*world.scoreboard.setObjectiveAtDisplaySlot(DisplaySlotId.Sidebar, {
            objective: trueDB!,
        });*/
        console.log("configDB :: Cleared " + allDB.length + " database(s).");
        if (!trueDB) {
            if (config.sendDataBaseMessage) world.sendMessage(new rawstr(true, "c").tra("db.delun").parse());
            console.log("configDB :: Failed to find the database from the world.");
        } else {
            trueDBId = trueDB.id;
        }
    } else {
        const name = "matrix:" + randomString(config.hashlength);
        const newObj = world.scoreboard.addObjective(name, mark);
        const stringGiven = getChangers();
        newObj.setScore(stringGiven, 1);
        trueDBId = newObj.id;
    }
    // Generate fake people
    system.runJob(confuseGenerator(config.confuse, mark));
    if (config.sendDataBaseMessage) world.sendMessage(new rawstr(true, "g").tra("db.gen", config.confuse.toString()).parse());
    console.log("configDB :: Sucessfully generated the confuse scoreboard (x" + config.confuse + ").");
    const currentDataBase = world.scoreboard.getObjective(trueDBId)!;
    const currentChanger = currentDataBase.getParticipants()[0].displayName;
    if (config.autorecover) {
        world.setDynamicProperty("config", currentChanger);
        // Reload the dynamic config
        await initialize();
        if (config.sendDataBaseMessage) world.sendMessage(new rawstr(true, "7").str("(Auto Recover) §g").tra("db.suc").parse());
        console.log("configDB :: Sucessfully recover the config from database.");
        //world.sendMessage(currentChanger);
    }
}

export function commitChanges(forced: boolean = false) {
    if (!forced && !c().configDataBase.autoCommit) return;
    system.run(async () => {
        await system.waitTicks(10);
        const changers = getChangers();
        // world.sendMessage(getChangers());
        const currentDataBase = world.scoreboard.getObjective(trueDBId)!;
        currentDataBase.removeParticipant(currentDataBase.getParticipants()[0]);
        currentDataBase.setScore(changers, 1);
    });
}

export async function recoverChanges() {
    const currentDataBase = world.scoreboard.getObjective(trueDBId)!;
    const currentChanger = currentDataBase.getParticipants()[0].displayName;
    world.setDynamicProperty("config", currentChanger);
    // Reload the dynamic config
    await initialize();
    console.log("configDB :: Sucessfully recover the config from database.");
}

function randomString(length: number) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// Generate something that is confuse!
function* confuseGenerator(confuse: number, mark: string) {
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
