import { GobalData } from "../util/DataBase.js";

//output the moving config from DataBase Util
export default JSON.parse(String(GobalData.get('config')))