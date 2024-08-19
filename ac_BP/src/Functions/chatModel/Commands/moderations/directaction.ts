import { system, world } from "@minecraft/server";
import { registerCommand, sendErr, verifier } from "../../CommandHandler";
import { ActionFormData, FormCancelationReason } from "@minecraft/server-ui";
import { c, isAdmin, rawstr } from "../../../../Assets/Util";
import { Action } from "../../../../Assets/Action";

registerCommand({
    name: "directaction",
    description: "Direct to do an moderation action on a player without typing it's name.",
    parent: false,
    maxArgs: 0,
    minArgs: 0,
    argRequire: [],
    require: (player) => verifier(player, c().commands.directaction),
    executor: async (player, _args) => {
        player.sendMessage(new rawstr(true, "g").tra("ui.closechat").parse());
        const form = new ActionFormData()
        .title("Direct Action Selector")
        .body("In this ui, section sign or quotation marks won't affect you to do the action to the selected player.");
        const allPlayers = world.getAllPlayers();
        const matchPlayers = allPlayers.filter(player => !isAdmin(player))
        matchPlayers.forEach(({ name }) => {
            form.button(clearName(name));
        })
        if (matchPlayers.length == 0) {
            player.sendMessage(new rawstr(true, "c").str("No player which is not admin online.").parse());
            return;
        }
        const runId = system.runInterval(() => {
            //@ts-expect-error
            form.show(player).then((res) => {
                if (res.canceled) {
                    if (res.cancelationReason == FormCancelationReason.UserClosed) {
                        system.clearRun(runId);
                    }
                    return;
                } else {
                    system.clearRun(runId);
                }
                const target = matchPlayers[res.selection!];

                new ActionFormData()
                    .title("Direct Action [" + clearName(target.name) + "]")
                    .body("Select your action wanted.")
                    .button("Tempkick")
                    .button("Ban (forever)")
                    //@ts-expect-error
                    .show(player).then((res) => {
                        if (res.canceled || world.getPlayers({ name: target.name }).length == 0) {
                            return;
                        }

                        switch (res.selection) {
                            case 0: {
                                Action.tempkick(target);
                                break;
                            }
                            case 1: {
                                Action.ban(target, "Direct Action", player.name, "forever");
                                break;
                            }
                        }
                        world.sendMessage(new rawstr(true, "g").tra("directaction.success", player.name, target.name).parse());
                    })
            }).catch((err) => {
                sendErr(err);
                system.clearRun(runId);
            })
        }, 20)
    }
})

function clearName (name: string) {
    return name
        .replaceAll("§", "<ss>")
}