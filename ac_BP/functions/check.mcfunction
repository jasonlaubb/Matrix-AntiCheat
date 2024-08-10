tag @s remove "matrix:no-beta-api"
execute unless score "matrix:beta-api-enabled" "matrix:api" matches -2048 run tag @s add "matrix:no-beta-api"
tellraw @s {"rawtext":[{"text":"§bMatrix §7>§g "},{"translate":"function.check.title","with":[]}]}
tellraw @s[tag="matrix:no-beta-api"] {"rawtext":[{"translate":"function.check.betaapi","with":["§cFALSE"]}]}
tellraw @s[tag=!"matrix:no-beta-api"] {"rawtext":[{"translate":"function.check.betaapi","with":["§aTRUE"]}]}
tellraw @s[tag="alive"] {"rawtext":[{"translate":"function.check.playerjson","with":["§aTRUE"]}]}
tellraw @s[tag=!"alive"] {"rawtext":[{"translate":"function.check.playerjson","with":["§cFALSE"]}]}
tellraw @s {"rawtext":[{"translate":"function.check.helpa","with":[]}]}
tellraw @s {"rawtext":[{"translate":"function.check.helpb","with":[]}]}
tellraw @s {"rawtext":[{"translate":"function.check.helpc","with":[]}]}
tellraw @s {"rawtext":[{"translate":"function.check.helpd","with":[]}]}
tag @s remove "matrix:no-beta-api"