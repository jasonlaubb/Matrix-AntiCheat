import { Module } from "../../matrixAPI";
import { rawtextTranslate } from "../../util/rawtext";
`^[a-zA-Z0-9_.-]{3,16}$`
new Module()
	.addCategory("detection")
	.setName(rawtextTranslate("module.namespoof.name"))
	.setDescription(rawtextTranslate("module.namespoof.description"))
	.setToggleId("antiNamespoof")
	.setPunishment("ban")
	.onModuleEnable(() => {
		
	})
	.onModuleDisable(() => {
		
	})
	.register();
