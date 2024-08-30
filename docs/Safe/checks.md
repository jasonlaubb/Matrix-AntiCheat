# Detctions

Updated to V4.0.7 Matrix AntiCheat version

!> Not including most of the 'Misc' modules.

# Aim

Toggle id: `antiAim`

(A) => Checks if player has interger rotations.

(B) => Checks if player has smooth rotations.

(E) => Checks if player has stright rotation movements.

# MobAura

Toggle id: `antiAura`

(A) => Checks if player hit the dummy when they enter combat.

# Auto Clicker

Toggle id: `antiAutoClicker`

(A) => Checks if player has high average click per second.

(B) => Checks if player hit entity in a short interval.

# Kill Aura

Toggle id: `antiKillAura`

(A) => Checks if player hit muitiple entities in a single tick.

(B) => Checks if player player hit the player out of the screen (larger than 120 degrees).

(C) => Checks if player hit player out of the range that the current rotation can reach.

(D) => Checks for perfect aimming to a target.

!> Type D is still experimental, it is disabled.

(E) => Checks if player hit player when he is sleeping.

(F) => Checks if player keeps high rotation speed in a longer period.

(G) => Checks for instant rotation to the target.

(H) => Checks for smooth horizontal pitch of player.

(I) => Checks if player rotation can be divided by 1.

(J) => Checks if player hit player without swing hand.

(K) => Checks if player contains illegal rotate speed pattern.

# Reach

Toggle id: `antiReach`

(A) => Checks if player attack entity out of their attack distance.

# Spammer

Toggle id: `antiSpammer`

(A) => Checks if player send message with hand swings.

(B) => Checks if player send message while using item.

(C) => Checks if player send message while moving.

# Client Authentication

Toggle id: `clientAuth`

- Let the players disconnect if they are detected as a bot.

# Fly

Toggle id: `antiFly`

(A) => Checks if the player is using flying hacks.

(B) => Checks for unnatural velocity movement.

(C) => Checks if player contains illegal velocity while on the ground.

(D) => Checks if player contains high velocity.

(E) => Checks if player moving high Y location and contains higher velocity.

# NoClip

Toggle id: `antiNoclip`

(A) => Checks if player moved through solid blocks.

(B) => Checks for illegal horizontal velocity pattern which is bds predicted, with low Y velocity.

(C) => Checks for illegal horizontal velocity pattern which is bds predicted, with high Y velocity.

# NoFall

Toggle id: `antiNoFall`

(A) => Checks if player contains no Y velocity in the air for a period.

# NoSlow

Toggle id: `antiNoSlow`

(A) => Checks if player is moving fast in the spider web.

(B) => Checks if player has high speed when using item.

!> Type B is still experimental, it is disabled.

# Speed

Toggle id: `antiSpeed`

(A) => Checks if player has high horizontal speed different.

(B) => Checks for illegal horizontal velocity pattern which is bds predicted.

# Timer

Toggle id: `antiTimer`

(A) => Checks if player moved block distance don't match it own velocity.

# FastUse

Toggle id: `antiFastUse`

(A) => Checks for short item use interval.

# GameMode

Toggle id: `antiGameMode`

(A) => Checks if player is in banned gamemode.

# Illegal Item

Toggle id: `antiIllegalItem`

(A) => Checks if the item is not a vanilla item of Minecraft.

(B) => Checks if the item has vanilla item name length.

(C) => Checks if the item stack amount is valid.

(D) => Checks if the item contains lore which is not vanilla.

(E) => Checks if the item contains extra NBT which is not vanilla.

(F) => Checks if the item keep on death.

(G) => Checks if the item has correct durability.

(H) => Search in the database whether the item is illegal.

(I) => Try if the item enchantment is valid for vanilla.

(J) => Checks if the enchantment level in the valid range.

(K) => Checks if the item contains duplicate enchantments.

# Name Spoof

Toggle id: `antiNameSpoof`

(A) => Checks if the player name is too long or too short.

(B) => If the player name is illegal, flag the player.

(C) => Checks if player name contains unkickable words.

# Off Hand

Toggle id: `antiOffHand`

(A) => Checks if player equip an item while moving.

(B) => Checks if player equip an item while attacking.

(C) => Checks if player equip an item while opening chest.

# Auto Tool

Toggle id: `antiAutoTool`

(A) => Checks if player switching tools on start breaking block.

# Breaker

Toggle id: `antiBreaker`

(A) => Checks if player breaking bed when the block is covered with solid block.

!> This is still experimental, it is disabled.

(B) => Checks if player breaking block when the block is covered with solid block.

(C) => Checks if player breaking block when there is block blocked in the way.

# FastBreak

Toggle id: `antiFastBreak`

(A) => Checks if player breaks block with high speed.

(B) => Checks if player breaks a block without start breaking it.

!> This is still experimental, it is disabled.

# Nuker

Toggle id: `antiNuker`

(A) => Checks if player breaks multiple blocks in a single tick.

# Scaffold

Toggle id: `antiScaffold`

(A) => Checks if rotation is a number that can be divided by the factor.

(B) => Checks if the angle is higher than the max angle.

(C) => Checks if the rotation is lower than the min rotation and the block is under the player.

(D) => Checks for high block per second of placing blocks.

(E) => Checks for diag scaffold.

(F) => Checks for unnatural rotating head with placing blocks.

(G) => Checks for invalid high extender with high rotation.

(H) => Checks for invalid low extender with low rotation.

(I) => Checks if player placed block which is invalid.

(J) => Checks if player placed block without hand swinging.

# Tower

Toggle id: `antiTower`

(A) => Checks if player is using tower hacks.