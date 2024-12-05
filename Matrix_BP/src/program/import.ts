import { registerModeration } from "./system/moderation";
registerModeration();
import { registerTimeStampModule } from "./system/playerProperty";
registerTimeStampModule();
// Import the modules
import "./detection/firewall";
import "./detection/speed";
import "./detection/hop";
import "./detection/phase";
import "./detection/fly";
import "./detection/killaura";
import "./detection/aim";
import "./detection/timer";
import "./detection/namespoof";
import "./detection/scaffold";
import "./detection/insteabreak";
import "./detection/reach";
// Import the util modules
import "./utility/welcomer";
import "./utility/worldBorder";
import "./utility/chatRankAndAntiSpam";
import "./utility/antiAfk";
// Import the commands
import "./command/about";
import "./command/help";
import "./command/op";
import "./command/deop";
import "./command/setmodule";
import "./command/listmodule";
import "./command/set";