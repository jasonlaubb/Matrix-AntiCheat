registerCommand({
    name: "setadmin",
    description: "Set the admin permission level of a player",
    parent: false,
    maxArgs: 2,
    minArgs: 2,
    argRequire: [verifier.isNumber, verifier.isNumber],
    executor: (player: Minecraft.Player, args: string[]) => {
        const config = c();
        config[args[0]] = args[1];
        config.save();
    }
})