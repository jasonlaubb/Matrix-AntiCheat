import defaultConfig, { dynamic as dy } from "../../Data/Default";
import userConfig from "../../Data/Config";
const config: configi = dy.followUserConfig ? (userConfig as configi) : defaultConfig;
import { world } from "@minecraft/server";
import { configi } from "../../Modules/Modules";
import { commitChanges } from "./config_database";

let common = config;

export async function initialize() {
    Dynamic;
    const cypher = world.getDynamicProperty("config") as string;
    if (!cypher || !Array.isArray(JSON.parse(cypher))) {
        world.setDynamicProperty("config", "[]");
    } else {
        const normal = JSON.parse(cypher) as Changer[];

        for (const changer of normal) {
            const newCommon = await change(changer.target, changer.value, common);
            if (!newCommon) continue; // Prevent path error
            common = newCommon as configi;
        }
    }
    return;
}

export function getChangers() {
    return world.getDynamicProperty("config") as string;
}
export default class Dynamic {
    static readonly config = (): typeof defaultConfig => common;
    static configAsync = async (): Promise<typeof defaultConfig> => common;
    static readonly default = (): typeof defaultConfig => config;
    static get(key: string[]): string | boolean | number | (string | boolean | number)[] | undefined {
        let current: any = common;

        for (let i = 0; i < key.length; i++) {
            current = (current as { [key: string]: any })[key[i]];
            if (!current && current !== false) return undefined;
        }

        return current as unknown as string | boolean | number | (string | boolean | number)[];
    }
    static set(key: string[], value: string | boolean | number | (string | boolean | number)[]): void {
        // world.sendMessage(c().flagMode.toString());
        const cypher = world.getDynamicProperty("config") as string;
        // a
        // world.sendMessage(`${cypher}\n${dynamic.key}`);
        const plaintext = JSON.parse(cypher) as Changer[];
        const foundIndex = plaintext.findIndex((changer) => JSON.stringify(changer.target) == JSON.stringify(key));
        if (foundIndex > -1) {
            plaintext.splice(
                plaintext.findIndex((changer) => JSON.stringify(changer.target) == JSON.stringify(key)),
                1
            );
        }
        plaintext.push({ target: key, value: value });
        world.setDynamicProperty("config", JSON.stringify(plaintext));
        // Reload the dynamic config
        initialize();
        if (config.configDataBase.autoCommit) commitChanges();
    }

    static delete(key: string[]) {
        const cypher = world.getDynamicProperty("config") as string;
        let plaintext = JSON.parse(cypher) as Changer[];
        const index = plaintext.findIndex((changer) => JSON.stringify(changer.target) == JSON.stringify(key));
        if (index == -1) return false;
        plaintext[index] = undefined!;
        plaintext = plaintext.filter((changer) => changer);
        world.setDynamicProperty("config", JSON.stringify(plaintext));
        // Reload the dynamic config
        initialize();
        if (config.configDataBase.autoCommit) commitChanges();
        return true;
    }
}

async function change(path: string[], value: string | boolean | number | (string | boolean | number)[], object: { [key: string]: any }) {
    try {
        const pathLength = path.length;
        const arr = new Array(26);
        for (let i = 0; i < path.length; i++) {
            arr[i] = path[i];
        }
        // world.sendMessage(JSON.stringify(arr) + "\n" + value + "\n" + pathLength);
        const [a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z] = path;
        switch (pathLength) {
            case 0:
                break;
            case 1:
                object[a] = value;
                break;
            case 2:
                object[a][b] = value;
                break;
            case 3:
                object[a][b][c] = value;
                break;
            case 4:
                object[a][b][c][d] = value;
                break;
            case 5:
                object[a][b][c][d][e] = value;
                break;
            case 6:
                object[a][b][c][d][e][f] = value;
                break;
            case 7:
                object[a][b][c][d][e][f][g] = value;
                break;
            case 8:
                object[a][b][c][d][e][f][g][h] = value;
                break;
            case 9:
                object[a][b][c][d][e][f][g][h][i] = value;
                break;
            case 10:
                object[a][b][c][d][e][f][g][h][i][j] = value;
                break;
            case 11:
                object[a][b][c][d][e][f][g][h][i][j][k] = value;
                break;
            case 12:
                object[a][b][c][d][e][f][g][h][i][j][k][l] = value;
                break;
            case 13:
                object[a][b][c][d][e][f][g][h][i][j][k][l][m] = value;
                break;
            case 14:
                object[a][b][c][d][e][f][g][h][i][j][k][l][m][n] = value;
                break;
            case 15:
                object[a][b][c][d][e][f][g][h][i][j][k][l][m][n][o] = value;
                break;
            case 16:
                object[a][b][c][d][e][f][g][h][i][j][k][l][m][n][o][p] = value;
                break;
            case 17:
                object[a][b][c][d][e][f][g][h][i][j][k][l][m][n][o][p][q] = value;
                break;
            case 18:
                object[a][b][c][d][e][f][g][h][i][j][k][l][m][n][o][p][q][r] = value;
                break;
            case 19:
                object[a][b][c][d][e][f][g][h][i][j][k][l][m][n][o][p][q][r][s] = value;
                break;
            case 20:
                object[a][b][c][d][e][f][g][h][i][j][k][l][m][n][o][p][q][r][s][t] = value;
                break;
            case 21:
                object[a][b][c][d][e][f][g][h][i][j][k][l][m][n][o][p][q][r][s][t][u] = value;
                break;
            case 22:
                object[a][b][c][d][e][f][g][h][i][j][k][l][m][n][o][p][q][r][s][t][u][v] = value;
                break;
            case 23:
                object[a][b][c][d][e][f][g][h][i][j][k][l][m][n][o][p][q][r][s][t][u][v][w] = value;
                break;
            case 24:
                object[a][b][c][d][e][f][g][h][i][j][k][l][m][n][o][p][q][r][s][t][u][v][w][x] = value;
                break;
            case 25:
                object[a][b][c][d][e][f][g][h][i][j][k][l][m][n][o][p][q][r][s][t][u][v][w][x][y] = value;
                break;
            case 26:
                object[a][b][c][d][e][f][g][h][i][j][k][l][m][n][o][p][q][r][s][t][u][v][w][x][y][z] = value;
                break;
            default:
                throw new Error("Dynamic :: Max length is 26");
        }
        return object;
    } catch (error) {
        return null;
    }
}

interface Changer {
    target: string[];
    value: string | boolean | number | (string | boolean | number)[];
}
