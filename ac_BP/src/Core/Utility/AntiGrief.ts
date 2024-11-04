import { BlockExplodeAfterEvent, GameRule, GameRuleChangeAfterEvent, PlayerBreakBlockBeforeEvent, world } from "@minecraft/server";
import { configi, registerModule } from "../Modules";
import { MinecraftBlockTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
async function antiExplodeDestroy (_config: configi, event: BlockExplodeAfterEvent) {
	const block = event.block;
	const blockData = event.explodedBlockPermutation;
	block.dimension.getEntities({
		type: "minecraft:item",
		location: block.location,
		maxDistance: 2.5,
	}).forEach((item) => item.kill());
	block.setPermutation(blockData);
}
const unchangeGameRule = [
	GameRule.DoFireTick,
	GameRule.MobGriefing,
]
async function antiRuleChange (_config: configi, event: GameRuleChangeAfterEvent) {
	if (unchangeGameRule.includes(event.rule)) {
		(world.gameRules[event.rule] as boolean) = false;
	} 
}
async function antiStructureVoidBreaks (_config: configi, event: PlayerBreakBlockBeforeEvent) {
	if (event.block.typeId != MinecraftBlockTypes.StructureVoid) return;
	event.cancel = true;
}
registerModule("antiGrief", false, [], {
	worldSignal: world.afterEvents.blockExplode,
	then: antiExplodeDestroy,
},
{
	worldSignal: world.afterEvents.gameRuleChange,
	then: antiRuleChange,
},
{
	worldSignal: world.beforeEvents.playerBreakBlock,
	then: antiStructureVoidBreaks,
});