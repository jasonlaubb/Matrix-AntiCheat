import { world } from "@minecraft/server";
const befEv = world.beforeEvents;
const aftEv = world.afterEvents;

export default {
	beforeEvents: {
		chat: befEv.chatSend,
		block_place: befEv.playerPlaceBlock,
		block_break: befEv.playerBreakBlock,
		block_interact: befEv.playerInteractWithBlock,
		entity_interact: befEv.playerInteractWithEntity,
		gamemode_change: befEv.playerGameModeChange,
		item_use: befEv.itemUse,
	},
	afterEvents: {
		block_place: aftEv.playerPlaceBlock,
		block_break: aftEv.playerBreakBlock,
		block_interact: aftEv.playerInteractWithBlock,
		entity_interact: aftEv.playerInteractWithEntity,
		gamemode_change: aftEv.playerGameModeChange,
		item_use: aftEv.itemUse,
		hit_entity: aftEv.entityHitEntity,
		damage: aftEv.entityHurt,
		player_spawn: aftEv.playerSpawn,
		player_leave: aftEv.playerLeave,
		dimension_change: aftEv.playerDimensionChange,
	}
}
export type BeforeEventString = "chat" | "block_place" | "block_break" | "block_interact" | "entity_interact" | "gamemode_change" | "item_use";
export type AfterEventString = "block_place" | "block_break" | "block_interact" | "entity_interact" | "gamemode_change" | "item_use" | "hit_entity" | "damage" | "player_spawn" | "player_leave" | "dimension_change";