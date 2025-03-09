function generateKey () {
	let input = document.getElementById("textbox").value;
	input = input.replace("export default", "").trim();
	if (input.endsWith(";")) input = input.slice(0, -1);
	if (!input.startsWith("{") || !input.endsWith("}")) {
		document.getElementById("output").innerHTML = "[Failed] Error: Not accepting input that is not start with { or end with }";
		return;
	}
	let parsed;
	try {
		parsed = stringToJson(input);
	} catch (error) {
		parsed = `${error.name}: ${error.message}`;
	}
	if (typeof parsed !== "object") {
		document.getElementById("output").innerHTML = `[Failed] ` + parsed;
		return;
	}
	const converted = convertJson(parsed);
	const output = Object.entries(converted).map(([key, value]) => {
		return `#${key},${typeof value === "boolean" ? (value ? "true" : "false") : value.toString()}#`;
	}).join("").replace(/#[(a-zA-Z)|/]+\,#/g, "");
	document.getElementById("output").innerHTML = output;
	document.getElementById("textbox").value = "";
}

function convertJson(obj, prefix = '') {
	const result = {};
	for (const key in obj) {
	    if (Object.prototype.hasOwnProperty.call(obj, key)) {
		    const newKey = prefix ? `${prefix}/${key}` : key;
		    if (typeof obj[key] === 'object') {
		        Object.assign(result, convertJson(obj[key], newKey));
		    } else {
		        result[newKey] = obj[key];
		    }
	    }
	}
	return result;
}

function stringToJson(str) {
	return JSON.parse(str.replace(/(\w+):/g, '"$1":').replace(/,[\s]*}/g, "}"));
}
function copyText() {
	var output = document.getElementById("output").textContent;
	navigator.clipboard.writeText(output).then(function() {
	  console.log("Text copied to clipboard");
	}, function(err) {
	  console.error("Could not copy text: ", err);
	});
}