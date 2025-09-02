import { mute, unmute } from "../command/mute";
import info from "../command/info";
import { detection, detectionList, detectionlist } from "../command/detection";
import { setBoolean, setNumber, setString, resetConfig, clearProperty, getProperty } from "../command/set";
import { rankadd, rankclear, ranklist, rankremove, rankset } from "../command/rank";
import watch, { cameraTypes, watchtp } from "../command/watch";
import antixray from "../command/antixray";
import { banCmd, banOffline, banlist, timeUnits, unban } from "../command/ban";
import worldBorder from "../command/worldBorder";
import invsee from "../command/invsee";
import flaglog from "../command/flaglog";
import chatrank from "../command/chatrank";
import antispam from "../command/antispam";
import antiafk from "../command/antiafk";
import { freecam, freecamspeed, freecamtp } from "../command/freecam";
import lockdown from "../command/lockdown";
import { banitem, banitemclear, banitemlist, unbanitem } from "../command/banItem";
import { automute, enterchat } from "../command/automute";
import echestwipe from "../command/echestwipe";
import invcopy from "../command/invcopy";
import flagMessageTarget from "../command/flagMessageTarget";
import setPunishment from "../command/setPunishment";
import oreAlert from "../command/oreAlert";
import ui from "../command/ui";
import { endLock, netherLock } from "../command/dimensionLock";
import { Command } from "../main";
import { getPropertyType } from "../util/propertyClassifier";
import property from "./property";
import { messageTarget, punishmentType } from "./prototype";
import commandList from "../command/commandList";
import fakeleave from "../command/fakeleave";
import { warn, warnclear, warnlist, warnof, warnreset, warns } from "../command/warn";
import deviceinfo from "../command/deviceinfo";
import itemui from "../command/itemui";
export const commands = [
    info,
    setBoolean,
    setNumber,
    setString,
    resetConfig,
    clearProperty,
    getProperty,
    detection,
    detectionlist,
    rankadd,
    rankclear,
    ranklist,
    rankremove,
    rankset,
    watch,
    watchtp,
    antixray,
    banCmd,
    banOffline,
    banlist,
    unban,
    worldBorder,
    invsee,
    oreAlert,
    endLock,
    netherLock,
    mute,
    unmute,
    flaglog,
    chatrank,
    antispam,
    antiafk,
    freecam,
    freecamspeed,
    freecamtp,
    lockdown,
    banitem,
    banitemlist,
    banitemclear,
    unbanitem,
    automute,
    enterchat,
    echestwipe,
    invcopy,
    flagMessageTarget,
    setPunishment,
    ui,
    commandList,
    fakeleave,
    warn,
    warnclear,
    warnlist,
    warnof,
    warnreset,
    warns,
    deviceinfo,
    itemui,
] as Command[];
const { stringValue, booleanValue, numberValue } = getPropertyType();
export const enumRegistry: { [key: string]: string[] } = {
    stringProperty: stringValue.sort(),
    numberProperty: numberValue.sort(),
    booleanProperty: booleanValue.sort(),
    property: Object.keys(property).sort(),
    detectionName: Object.keys(detectionList).sort(),
    viewType: cameraTypes,
    timeUnit: timeUnits,
    messageTarget: messageTarget,
    punishmentType: punishmentType,
};
