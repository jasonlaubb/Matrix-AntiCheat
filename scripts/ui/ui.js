import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { world } from "@minecraft/server";
import { moderateAction } from "../Moderation/moderation";

function isPlayerOnline (player) {
  return !!world.getPlayers({ name: player.name })[0]
};

//main
function openTheUI (player) {
  new ActionFormData()
    .title("Matrix UI")
    .button("Manage Tool")
    .show(player).then(res => {
      const select = res.selection
      if (res.canceled) return
      if (select === 0) {
        openManageUI (player)
        return
      }
    })
};

function openManageUI (player) {
  const AllPlayers = world.getAllPlayers();

  const form = (
    new ActionFormData()
      .title("Matrix UI")
      .body("Please choose a player!")
  )
  for (const p of AllPlayers) {
    if (player.id === p.id) {
      form.button(`${p.name}\n§cThis is you!`)
      continue
    }
    if (p.hasTag("MatrixOP")) {
      form.button(`${p.name}\n§cAdmin`)
      continue
    }
    form.button(p.name)
  }
  form.show(player).then(res => {
    if (res.canceled) return
    const target = AllPlayers[res.selection];

    if (!isPlayerOnline(target)) return player.sendMessage(`§e[§cMatrix§e] §b${target.name} §chas left the game!`);

    if (target.hasTag("MatrixOP")) {
      inputManageUI.isAdmin(target, player)
      return
    }
    inputManageUI.isPlayer(target, player)
  })
};

const getReasonForm = new ModalFormData()
  .title('Matrix UI')
  .textField('Reason', 'Enter your reason here')

class inputManageUI {
  static isAdmin (player, admin) {
    new ActionFormData ()
      .title(`Player - ${player.name}`)
      .body('What do you what to do?')
      .button('View data')
      .button('back')
      .show(admin).then(res => {
        if (res.canceled) return;
        if (!isPlayerOnline(player)) return admin.sendMessage(`§e[§cMatrix§e] §b${player.name} §chas left the game!`);

        const select = res.selection

        if (select === 0) {
          inputViewData(player, admin, true)
          return
        }

        openTheUI(admin)
      })
  }
  static isPlayer (player, admin) {
    if (!isPlayerOnline(player)) return admin.sendMessage(`§e[§cMatrix§e] §b${player.name} §chas left the game!`);

    new ActionFormData()
      .title(`Player - ${player.name}`)
      .body('What do you what to do?')
      .button('View data')
      .button('Ban')
      .button('Kick')
      .button('Freeze')
      .button('Mute')
      .button('Unmute')
      .button('Unfreeze')
      .button('back')
      .show(admin).then(res => {
        if (res.canceled) return;
        if (!isPlayerOnline(player)) return admin.sendMessage(`§e[§cMatrix§e] §b${player.name} §chas left the game!`);

        const select = res.selection;
        if (select === 0) {
          inputViewData(player, admin, false)
          return
        };
        if (select === 1) {
          getReasonForm.show(admin).then(res => {
            if (res.canceled) return;
            if (!isPlayerOnline(player)) return admin.sendMessage(`§e[§cMatrix§e] §b${player.name} §chas left the game!`);
            new moderateAction(player, admin).ban(res.formValues[0])
            return
          })
          return
        }
        if (select === 2) {
          getReasonForm.show(admin).then(res => {
            if (res.canceled) return;
            if (!isPlayerOnline(player)) return admin.sendMessage(`§e[§cMatrix§e] §b${player.name} §chas left the game!`);
            new moderateAction(player, admin).kick(res.formValues[0])
            return
          })
          return
        }
        if (select === 3) {
          getReasonForm.show(admin).then(res => {
            if (res.canceled) return;
            if (!isPlayerOnline(player)) return admin.sendMessage(`§e[§cMatrix§e] §b${player.name} §chas left the game!`);
            new moderateAction(player, admin).freeze(res.formValues[0], player)
            return
          })
          return
        }
        if (select === 4) {
          getReasonForm.show(admin).then(res => {
            if (res.canceled) return;
            if (!isPlayerOnline(player)) return admin.sendMessage(`§e[§cMatrix§e] §b${player.name} §chas left the game!`);
            new moderateAction(player, admin).mute(res.formValues[0])
            return
          })
          return
        }
        if (select === 5) {
          new moderateAction(player, admin).unmute()
          return
        }
        if (select === 6) {
          new moderateAction(player, admin).unfreeze()
          return
        }

        openTheUI(admin)
      })
  }
}

const viewDataModel = (player) => {
  return [
    '§g-- Properties --',
    `§eUniqueId §8> §b${player.id}`,
    `§eLocation §8> §b${player.location.x.toFixed(3)} ${player.location.y.toFixed(3)} ${player.location.z.toFixed(3)}`,
    `§eDimension §8> §b${player.dimension.id}`,
    `§eFallDistance §8> §b${player.fallDistance}`,
    `§eisClimbing §8> §b${player.isClimbing}`,
    `§eisFalling §8> §b${player.isFalling}`,
    `§eisInWater §8> §b${player.isInWater}`,
    `§eisOnGround §8> §b${player.isOnGround}`,
    `§eisSleeping §8> §b${player.isSleeping}`,
    `§eisSneaking §8> §b${player.isSneaking}`,
    `§eisSprinting §8> §b${player.isSprinting}`,
    `§eisSwimming §8> §b${player.isSwimming}`
  ].join('\n')
}

function inputViewData (player, admin, back) {
  new ActionFormData()
    .title(`View data | ${player.name}`)
    .body(viewDataModel(player))
    .button('back')
    .show(admin).then(res => {
      if (res.canceled) return;
      if (back === true) {
        inputManageUI.isAdmin(player, admin)
      } else {
        inputManageUI.isPlayer(player, admin)
      }
    })
};

//export the main ui model to ui handler
export { openTheUI }