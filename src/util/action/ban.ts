import { Player, system, world } from '@minecraft/server';
import config from '../../data/config.js';
import { uniqueId, getTimePeriod } from '../World.js';
import { GobalData } from '../DataBase.js';
import { ActiveTempkick } from './tempkick.js';

const doBanOn = (player: Player, ms?: number, reason?: string, banby?: string) => {
  if (uniqueId(player)) return;
  player.getTags().filter(tag => tag.startsWith('nokararosBan:§k')).forEach(tag => player.removeTag(tag));
  const banTime = ms ? ms + Date.now() : undefined;
  const banInfo = {
    time: banTime ? banTime : 'LifeTime',
    reason: reason ? reason : 'No reason provided',
    banby: banby ? banby : 'Unknown',
    token: GobalData.get('bantoken')
  }
  player.runCommand(`tag @s add "nokararosBan:§k${JSON.stringify(banInfo)}"`);
  player.addTag(`anticheat:isBanned`)
};

const banSystem = () => {
  system.runInterval(() => {
    for (const player of world.getPlayers({tags: ['anticheat:isBanned']})) {
      const alltag = player.getTags().filter(tag => tag.startsWith('nokararosBan:§k'));
      if (!alltag) {
        console.warn(`No banInfo on ${player.name}`);
        continue
      };
      for (const baninfo of alltag) {
        const BAN_INFO = JSON.parse(baninfo.replace('nokararosBan:§k',''));
        if (!BAN_INFO) player.removeTag(baninfo);
        if (BAN_INFO.token === GobalData.get('bantoken')) {
          if (BAN_INFO.time <= Date.now()) {
            player.removeTag(baninfo);
            console.log(`Remove Ban tag from ${player.name} as he reached unban date`)
          } else {
            try {
              const banTime = BAN_INFO.time == 'LifeTime' ? 'LifeTime' : `${getTimePeriod(BAN_INFO.time).days}d ${getTimePeriod(BAN_INFO.time).hours}h ${getTimePeriod(BAN_INFO.time).minutes}m ${getTimePeriod(BAN_INFO.time).seconds}s`
              player.runCommand(`kick "${player.name}" "\n§dnokararos §f> §c§lYOU ARE BANNED!\n§r§7Length: §9${banTime}\n§7Reason: §9${BAN_INFO.reason}\n§7Appeal at §9${config.system.punishment.ban.AppealAt}"`);
            } catch {
              ActiveTempkick(player);
              console.warn(`force tempkicked ${player.name}`)
            }
          }
        } else player.removeTag(baninfo)
      }
    }
  })
};

export { banSystem, doBanOn }
