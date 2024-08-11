# Command Usage

This pages describes how to use the commands of Matrix AntiCheat.

- `<prefix>` defaultly is `-`.
- `<arg>` means that the argument is required.
- `[arg]` means that the argument is optional.
- `[arg] ... [arg]` means that the argument can be repeated infinitely.
- `...` means that it's a no argument subcommand.`

# Helps commands

Command about helps. Let you know how to use the anticheat.

# About

- Description

Get the information about Matrix AntiCheat.

?> This command cannot be modified in config

- Usage

Args: `No args`

Example: `<prefix>about`

# Help

- Description

Get the help menu of Matrix AntiCheat.

- Usage

Args: `No args`

Example: `<prefix>help`

# Moderation commands

Management of the players in the server.

# Ban

- Description

Ban a player.

- Usage

Args: `ban <player> [reason] [time]`

Example1: `<prefix>ban steve`

Example2: `<prefix>ban steve testing 11m21d14h11s`

Example3: `<prefix>ban steve "Bye, Steve" forever`

# Banqueue

- Description

Ban a player which is offline.

- Usage

Args1: `banqueue add <player> <reason> <time>`

Args2: `banqueue remove <player name>`

Args3: `banqueue list`

Example1: `<prefix>banqueue add steve testing 11m21d14h11s`

Example2: `<prefix>banqueue remove steve`

Example3: `<prefix>banqueue list`

!> This command might contains bugs.

# Bypasslist

- Description

Add or remove a player from the bypasslist.

- Usage

Args1: `bypasslist add <player>`

Args2: `bypasslist remove <player name>`

Args3: `bypasslist list`

Example1: `<prefix>bypasslist add steve`

Example2: `<prefix>bypasslist remove steve`

Example3: `<prefix>bypasslist list`

!> This command might contains bugs.

# Deop

- Description

Deop a player.

- Usage

Args: `deop <player>`

Example: `<prefix>deop steve`

# Echestwipe

- Description

Wipe the ender chest of a player.

- Usage

Args: `echestwipe <player>`

Example: `<prefix>echestwipe steve`

# Freeze

- Description

Freeze a player.

- Usage

Args: `freeze <player>`

Example: `<prefix>freeze steve`

# Invcopy

- Description

Copy the inventory of a player.

- Usage

Args: `invcopy <player>`

Example: `<prefix>invcopy steve`

# Invsee

- Description

See the inventory of a player.

- Usage

Args: `invsee <player>`

Example: `<prefix>invsee steve`

# Invof

- Description

Get the inventory of a player.

- Usage

Args: `invof <player>`

Example: `<prefix>invof steve`

# Mute

- Description

Mute a player.

- Usage

Args: `mute <player>`

Example: `<prefix>mute steve`

# Op

- Description

Op a player or get op by password.

- Usage

Args1: `op <password>`

?> This argument can only be used for non-admin players.

Args2: `op <player>`

Example1: `<prefix>op password`

Example2: `<prefix>op steve`

# Rank

- Description

Rank related commands.

- Usage

Args1: `rank add <player> <rank>`

Args2: `rank remove <player> <rank>`

Args3: `rank set <player> <rank>`

> Remove all the ranks of the player, and add a new rank on the player

Example1: `<prefix>rank add steve admin`

Example2: `<prefix>rank remove steve admin`

Example3: `<prefix>rank set steve admin`

# Tempkick

- Description

Temporarily kick a player. Especially for local world, this command can let the player join again

- Usage

Args: `tempkick <player>`

Example: `<prefix>tempkick steve`

# Unban

- Description

Unban related command.

- Usage

Args1: `unban add <player>`

Args2: `unban remove <player>`

Args3: `unban list`

Example1: `<prefix>unban add steve`

Example2: `<prefix>unban remove steve`

Example3: `<prefix>unban list`

# Unfreeze

- Description

Unfreeze a player.

- Usage

Args: `unfreeze <player>`

Example: `<prefix>unfreeze steve`

# Unmute

- Description

Unmute a player.

- Usage

Args: `unmute <player>`

Example: `<prefix>unmute steve`

# Unvanish

- Description

Unvanish a player.

- Usage

Args: `unvanish <player>`

Example: `<prefix>unvanish steve`

# Vanish

- Description

Vanish a player.

- Usage

Args: `vanish <player>`

Example: `<prefix>vanish steve`

# Warn

- Description

Warn a player. Kimochi will automatically kick the player if the warn count is higher than 3 or others.

- Usage

Args: `warn <player> [reset]`

Example1: `<prefix>warn steve`

Example2: `<prefix>warn steve reset`

# Settings Commands

Command to help you setup your own anticheat.

# Antispam

- Description

Set antispam settings.

- Usage

Args: `antispam <type> <state>`

Example1: `<prefix>antispam spamFilter enable`

Example2: `<prefix>antispam chatFilter disable`

Example3: `<prefix>antispam linkEmailFilter enable`

# Banrun

- Description

Run a command when the player get banned or kicked.

- Usage

Args: `banrun [command]`

?> If the command is not given, the current banrun command will be removed.

Example1: `<prefix>banrun "tag @s add clown"`

Example2: `<prefix>banrun`

# Config

- Description

Do some changes on config.

- Usage

Args: `config set <type> <key> <value>`

Example1: `<prefix>config set string antiKillAura.punishment none`

Example2: `<prefix>config set boolean createScoreboard false`

Example3: `<prefix>config set number spawnFinishDelay 1500`

Example4: `<prefix>config set array otherPrefix "?","!"`

!> This command can throw

!> This command may contain some bugs

# Configdb

- Description

Set the config database.

- Usage

Args1: `configdb commit`

Args2: `configdb recover`

Args3: `configdb clear`

Args4: `configdb delete`

Example: `<prefix>configdb ...`

# Defaultrank

- Description

Set the default rank of the chatRank.

- Usage

Args: `defaultrank <rank>`

Example: `<prefix>defaultrank "§d§lCute Player§r"`

# Flagmode

- Description

Set the flag mode of the anticheat.

- Usage

Args: `flagmode <mode>`

Example1: `<prefix>flagmode none`

Example2: `<prefix>flagmode admin`

Example3: `<prefix>flagmode all`

Example4: `<prefix>flagmode bypass`

Example5: `<prefix>flagmode tag`

# Lockdown

- Description

Set the lockdown state of the anticheat.

- Usage

Args: `lockdown <code>`

Example: `<prefix>lockdown AbCdEf`

# Lockdowncode

- Description

Set the lockdown code of the anticheat.

- Usage

Args1: `lockdowncode get`

Args2: `lockdowncode set <code>`

Args3: `lockdowncode random [length]`

Example1: `<prefix>lockdowncode get`

Example2: `<prefix>lockdowncode set AbCdEf`

Example3: `<prefix>lockdowncode random 8`

# Passwords

- Description

Change the password of the anticheat.

- Usage

Args: `passwords <current password> <new password>`

Example: `<prefix>passwords password JasonlaubbIsSoCute`

# Reset

- Description

Reset the dynamic config of the anticheat.

?> This command cannot be modified or deleted in config.

!> This action **CANNOT** be reversed.

- Usage

Args: `No args`

Example: `<prefix>reset`

# Setutil

- Description

Toggle the utility module of the anticheat.

- Usage

Args: `setutil <module> <state>`

Example1: `<prefix>setutil chatRank disable`

Example2: `<prefix>setutil dimensionLock enable`

# Showallrank

- Description

Show all chatranks while chatting for each player.

- Usage

Args: `showallrank <boolean>`

Example1: `<prefix>showallrank true`

Example2: `<prefix>showallrank false`

# Toggle

- Description

Toggle the anticheat modules of the anticheat.

- Usage

Args: `toggle <module> <state> [confirmation]`

Example1: `<prefix>toggle antiFly enable`

Example2: `<prefix>toggle antiAim disable`

# Toggles

- Description

Show all the registered anticheat module's id of the anticheat.

- Usage

Args: `No args`

Example: `<prefix>toggles`

# Unlock

- Description

Unlock the server/realm from lockdown.

- Usage

Args: `No args`

Example: `<prefix>unlock`

# utility commands

The utility commands which give extra functions of the anticheat.

# Adminchat

- Description

Switch the chat channel for admin

- Usage

Args: `No args`

Example: `<prefix>adminchat`

# Itemui

- Description

Get the ui item of the anticheat.

- Usage

Args: `No args`

Example: `<prefix>itemui`

!> Holiday creator feature is required

# Matrixui

- Description

Open the admin gui directly.

- Usage

Args: `No args`

Example: `<prefix>matrixui`

# Openlog

- Description

Open the log record in a gui of the anticheat.

- Usage

Args: `No args`

Example: `<prefix>openlog`

# Packetlogger

- Description

Get or remove the packet logger permission.

- Usage

Args: `No args`

Example: `<prefix>packetlogger`

# Player commands

Some simple command can let player without admin permission to do something.

# Report

- Description

Report a player.

- Usage

Args: `report <player> [reason]`

Example: `<prefix>report steve "Bad cheat guys"`
