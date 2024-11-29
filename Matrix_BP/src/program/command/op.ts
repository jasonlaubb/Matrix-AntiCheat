import { Command } from "../../matrixAPI";
import { rawtextTranslate } from "../../util/rawtext";

new Command()
	.setName("op")
	.setAliases("getop", "getadmin", "gainop", "gainadmin")
	.setMinPermissionLevel(0)
	.setDescription(rawtextTranslate("command.op.description"))