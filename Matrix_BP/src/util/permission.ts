import { Player } from "@minecraft/server";
export { declarePermissionFunction };
function declarePermissionFunction () {
	Player.prototype.isAdmin = function () {
		return this.getDynamicProperty("uniqueLevel") ?? 0 >= 1;
	}
	Player.prototype.getPermissionLevel = function () {
		return this.getDynamicProperty("uniqueLevel") ?? 0;
	}
	Player.prototype.setPermissionLevel = function (level: number) {
		if (!Number.isInteger(level)) {
			throw new Error("Player :: setPermissionLevel :: Level must be an integer.");
		}
		if (level == 0) {
			this.setDynamicProperty("uniqueLevel");
		} else {
			this.setDynamicProperty("uniqueLevel", level);
		}
	}
}