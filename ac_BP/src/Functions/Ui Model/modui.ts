import { Player } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { rawstr } from "../../Assets/Util";
import { triggerCommand } from "../chatModel/CommandHandler";

interface AbcSelection {
    a: string;
    b?: string;
    c?: string;
    d?: string;
}

const groupAbc = ([a, b, c]: any[]): AbcSelection => ({ a, b, c });

async function cpu(form: ModalFormData, player: Player, to: string): Promise<AbcSelection | null> {
    const data = await form.show(player);
    if (data.canceled) return null;
    return groupAbc([to, ...data.formValues!]);
}

const moderateAction: { [key: number]: (arg: AbcSelection) => string } = {
    0: ({ a, b, c }) => `ban "${a}" "${b}" "${c}"`,
    1: ({ a }) => `freeze "${a}"`,
    2: ({ a }) => `unfreeze "${a}"`,
    3: ({ a }) => `mute "${a}"`,
    4: ({ a }) => `unmute "${a}"`,
    5: ({ a }) => `invcopy "${a}"`,
    6: ({ a }) => `invsee "${a}"`,
    7: ({ a }) => `echestwipe "${a}"`,
    8: ({ a }) => `tempkick "${a}"`,
};

// Match the ui
const moderateUI: { [key: number]: (player: Player, target: string) => Promise<AbcSelection | null> } = {
    0: async (p, t) => {
        const result = await cpu(banForm, p!, t ?? "null");
        return result;
    },
};

// For state that how to form a command
const banForm = new ModalFormData().title(rawstr.drt("ui.banplayer")).textField(rawstr.drt("ui.ban.reason"), rawstr.drt("ui.ban.placeholder")).textField(rawstr.drt("ui.ban.length"), "1d2h3m4s", "forever");

export async function moderatePlayer(player: Player, target: Player) {
    const action = await new ActionFormData()
        .title("Moderate " + target.name)
        .button(rawstr.drt("ui.ban.button"))
        .button(rawstr.drt("ui.freeze.button"))
        .button(rawstr.drt("ui.unfreeze.button"))
        .button(rawstr.drt("ui.mute.button"))
        .button(rawstr.drt("ui.unmute.button"))
        .button(rawstr.drt("ui.invcopy.button"))
        .button(rawstr.drt("ui.invsee.button"))
        .button(rawstr.drt("ui.echestwipe.button"))
        .button(rawstr.drt("ui.tempkick.button"))
        .button(rawstr.drt("ui.exit"), "textures/ui/redX1.png")
        .show(player);
    if (action.canceled) return;
    const actionData = moderateUI[action.selection!];
    let abcSelection: AbcSelection | null = { a: target.name };
    if (actionData) {
        // get the selection of player
        abcSelection = await actionData(player, target.name)!;
        if (abcSelection === null) return;
    } else if (action.selection! >= Object.keys(moderateAction).length) return;
    // Run an chat command for the player
    triggerCommand(player, moderateAction[action.selection!](abcSelection));
}
