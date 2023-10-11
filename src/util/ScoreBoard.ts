import { ScoreboardIdentity, world } from "@minecraft/server";

export class ScoreBoardDataBase {
  private name: string;
  
  public constructor (name: string) {
    this.name = name;
    if (world.scoreboard.getObjective('db:' + this.name)) {
      world.scoreboard.addObjective('db' + this.name, 'DATABASE')
    }
  };

  public get (key: string | number) {
    const target: ScoreboardIdentity | undefined = world.scoreboard.getObjective('db:' + this.name)?.getParticipants().filter(predicate => predicate.displayName.startsWith(`${key}:`))[0];
    if (target === undefined) {
      return undefined
    };

    return target.displayName.slice(0, (`${key}:`).length);
  };

  public set (key: string | number, value: string | number) {
    const target: ScoreboardIdentity | undefined = world.scoreboard.getObjective('db:' + this.name)?.getParticipants().filter(predicate => predicate.displayName.startsWith(`${key}:`))[0];
    if (target === undefined) {
      world.scoreboard.getObjective('db:' + this.name)?.setScore(`${key}:${value}`, 2147483647);
      return false
    } else {
      world.scoreboard.getObjective('db:' + this.name)?.removeParticipant(target);
      world.scoreboard.getObjective('db:' + this.name)?.setScore(`${key}:${value}`, 2147483647);
      return true
    }
  };

  public delete (key: string | number) {
    const target: ScoreboardIdentity | undefined = world.scoreboard.getObjective('db:' + this.name)?.getParticipants().filter(predicate => predicate.displayName.startsWith(`${key}:`))[0];
    if (target === undefined) {
      return false;
    } else {
      world.scoreboard.getObjective('db:' + this.name)?.removeParticipant(target);
      return true;
    };
  };

  public clear () {
    const target = world.scoreboard.getObjective('db:' + this.name);
    if (target?.getParticipants()?.length! <= 0) return false;

    target?.getParticipants().forEach(index => target.removeParticipant(index));
    return true
  };

  static listAll () {
    return world.scoreboard.getObjectives().filter(predicate => predicate.id.startsWith('db:')) ?? undefined
  };
};