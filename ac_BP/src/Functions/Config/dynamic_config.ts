//@ts-nocheck
import * as dy from "../../Data/Default";
import Config from "../../Data/Config";
const dynamic = dy.dynamic;
const config = dynamic.followUserConfig ? dy.default : Config;
import userConfig from "../../Data/Config";
import { AES } from "../../node_modules/crypto-es/lib/aes";
import { world } from "@minecraft/server";

let common = config;

export function initialize() {
    const cypher = world.getDynamicProperty("config") as string;

    if (!cypher) {
        const normal = AES.encrypt(JSON.stringify([]), dynamic.key);
        world.setDynamicProperty("dynamic", normal.toString());
    } else {
        const normal = JSON.parse(AES.decrypt(cypher, dynamic.key).toString()) as Changer[];

        for (const changer of normal) {
            const newCommon = change(changer.target, changer.value, common);
            if (!newCommon) continue; // Prevent path error
            common = newCommon;
        }
    }
}

export default class Dynamic {
    static readonly config = (): typeof dy.default => common;
    static readonly default = (): typeof dy.default => config;
    static get(key: string[]) {
        let current = common;

        for (let i = 0; i < key.length; i++) {
            current = current[key[i]];
            if (!current) return null;
        }

        return current;
    }
    static set(key: string[], value: string | boolean | number | (string | boolean | number)[]): void {
        const cypher = world.getDynamicProperty("config") as string;
        const plaintext = JSON.parse(AES.decrypt(cypher, dynamic.key).toString()) as Changer[];
        plaintext.push({ target: key, value: value });
        world.setDynamicProperty("config", AES.encrypt(JSON.stringify(plaintext), dynamic.key).toString());
        // Reload the dynamic config
        initialize();
    }

    static delete(key: string[]) {
        const cypher = world.getDynamicProperty("config") as string;
        let plaintext = JSON.parse(AES.decrypt(cypher, dynamic.key).toString()) as Changer[];
        const index = plaintext.findIndex((changer) => JSON.stringify(changer.target) == JSON.stringify(key));
        if (index == -1) return false;
        plaintext[index] = undefined;
        plaintext = plaintext.filter((changer) => changer);
        world.setDynamicProperty("config", AES.encrypt(JSON.stringify(plaintext), dynamic.key).toString());
        // Reload the dynamic config
        initialize();
        return true;
    }
}

function change(path: string[], value: string | boolean | number | (string | boolean | number)[], object: { [key: string]: any }) {
    try {
        const pathLength = path.length;
        for (let i = 0; i < 26 - pathLength; i++) {
            path.push(null);
        }
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
        console.warn(JSON.stringify(error));
        return null;
    }
}

interface Changer {
    target: string[];
    value: string | boolean | number | (string | boolean | number)[];
}
