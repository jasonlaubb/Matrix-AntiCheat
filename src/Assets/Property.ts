import * as Minecraft from "@minecraft/server";
Minecraft.Player.prototype.sendMsg =
function (...msg: (string | Minecraft.RawText)[]) {
    let message = { rawtext: [] } as Minecraft.RawMessage;
    msg.forEach((text) => {
        if (typeof text == "string") {
            message.rawtext.push({ text: text });
        } else {
            message.rawtext.push(text);
        }
    })
    this.sendMessage(message);
}
Minecraft.World.prototype.sendMsg =
function (...msg: (string | Minecraft.RawText)[]) {
    let message = { rawtext: [] } as Minecraft.RawMessage;
    msg.forEach((text) => {
        if (typeof text == "string") {
            message.rawtext.push({ text: text });
        } else {
            message.rawtext.push(text);
        }
    })
    this.sendMessage(message);
}