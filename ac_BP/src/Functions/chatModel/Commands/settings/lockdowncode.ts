import { registerCommand, verifier } from "../../CommandHandler";
import { c, rawstr } from "../../../../Assets/Util";
import Dynamic from "../../../Config/dynamic_config";

registerCommand(
    {
        name: "lockdowncode",
        description: "Lockdowncode related commands",
        require: (player) => verifier(player, c().commands.lockdowncode),
        parent: true,
    },
    {
        name: "get",
        description: "Get the lockdowncode",
        maxArgs: 0,
        minArgs: 0,
        argRequire: [],
        executor: async (player, _args) => {
            player.sendMessage(new rawstr(true, "g").tra("lockdowncode.get", c().lockdowncode).parse());
        }
    },
    {
        name: "set",
        description: "Set the lockdowncode",
        maxArgs: 1,
        minArgs: 1,
        argRequire: [(value) => (value as string).length > 2],
        executor: async (player, args) => {
            Dynamic.set(["lockdowncode"], args[0]);
            player.sendMessage(new rawstr(true, "g").tra("lockdowncode.set", c().lockdowncode).parse());
        }
    },
    {
        name: "random",
        description: "Generate a random lockdowncode",
        maxArgs: 1,
        minArgs: 0,
        argRequire: [(value) => {
            const code = Number(value as string)

            if (Number.isNaN(code)) return false;

            return code >= 1 && code <= 128
        }],
        executor: async (player, args) => {
            const codeLength = args[0] ?? 6;

            const candidate = [
                "A",
                "B",
                "C",
                "D",
                "E",
                "F",
                "G",
                "H",
                "I",
                "J",
                "K",
                "L",
                "M",
                "N",
                "O",
                "P",
                "Q",
                "R",
                "S",
                "T",
                "U",
                "V",
                "W",
                "X",
                "Y",
                "Z",
                "a",
                "b",
                "c",
                "d",
                "e",
                "f",
                "g",
                "h",
                "i",
                "j",
                "k",
                "l",
                "m",
                "n",
                "o",
                "p",
                "q",
                "r",
                "s",
                "t",
                "u",
                "v",
                "w",
                "x",
                "y",
                "z",
            ];

            let code = "";
            for (let i = 0; i < Number(codeLength); i++) {
                code += candidate[Math.floor(Math.random() * candidate.length)];
            }

            Dynamic.set(["lockdowncode"], code);

            player.sendMessage(new rawstr(true, "g").tra("lockdowncode.set", code).parse());
        }
    }
)