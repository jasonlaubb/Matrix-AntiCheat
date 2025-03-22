import fs from "fs";
fs.readDirSync(__dirname).forEach(file => {
	if (file.includes("shabby")) return;
	const get = fs.readFileSync(`${__dirname}/${file}`);
	const json = JSON.parse(get);
	json.description.menu_category = {
		"is_hidden_in_commands": true,
		"category": "none"
	}
	fs.writeFileSync(`${__dirname}/${file}`, JSON.stringify(json, null, 4));
})