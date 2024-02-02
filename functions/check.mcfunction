tag @s remove "matrix:no-beta-api"
tag @s remove "matrix:not-the-top"
execute unless score "matrix:beta-api-enabled" "matrix:api" matches -2048 run tag @s add "matrix:no-beta-api"
execute unless score "matrix:superlative-pack" "matrix:api" matches -2048 run tag @s add "matrix:not-the-top"
tellraw @s {"rawtext":[{"text":"§bMatrix §7>§g Anti-Cheat setup checking:"}]}
tellraw @s[tag="matrix:no-beta-api"] {"rawtext":[{"text":"§gBeta-API state: §cFALSE"}]}
tellraw @s[tag=!"matrix:no-beta-api"] {"rawtext":[{"text":"§gBeta-API state: §aTRUE"}]}
tellraw @s[tag="matrix:not-the-top"] {"rawtext":[{"text":"§gSuperlative pack: §cFALSE"}]}
tellraw @s[tag=!"matrix:not-the-top"] {"rawtext":[{"text":"§gSuperlative pack: §aTRUE"}]}
tellraw @s {"rawtext":[{"text":"§7- Beta-API: If it's false, please try to enable it in the world setting\n§7- Superlative pack: If it's false, please put Matrix anti-cheat on the top of packs\n- If the anticheat is still not working, please checks if your version is too old or too new (unsupported version)"}]}
tag @s remove "matrix:no-beta-api"
tag @s remove "matrix:not-the-top"