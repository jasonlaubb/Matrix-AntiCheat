import { registerModeration } from "./system/moderation";
registerModeration();
import { registerTimeStampModule } from "./system/playerProperty";
registerTimeStampModule();
// Import the modules
import "./detection/firewall";
import "./detection/speed";
import "./detection/phase";
import "./detection/fly";
import "./detection/killaura";
import "./detection/timer";
import "./detection/namespoof";
import "./detection/scaffold";
import "./detection/insteabreak";
import "./detection/reach";
// Import the commands
import "./command/about";
import "./command/help";
import "./command/op";