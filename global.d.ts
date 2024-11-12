import * as Server from "@minecraft/server";
import * as ServerUi from "@minecraft/server-ui";
import * as DebugUtilities from "@minecraft/debug-utilities";
declare module "@minecraft/server" {
	interface Player {
		isAdmin: () => boolean;
		getPermissionLevel: () => number;
		setPermissionLevel: (level: number) => void;
	}
}
interface Console {
	log: (message: string) => void;
	warn: (message: string) => void;
	error: (message: Error) => void;
}
declare global {
	var console: Console;
}