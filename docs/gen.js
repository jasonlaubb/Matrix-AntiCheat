var output = [];
var currentPart = 1;
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
	const outputt = Object.entries(converted).map(([key, value]) => {
		return `#${key},${typeof value === "boolean" ? (value ? "true" : "false") : value.toString()}#`;
	}).join("").replace(/#[(a-zA-Z)|/]+\,#/g, "");
	document.getElementById("textbox").value = "";
	currentPart = 1;
	console.log(truncateString(outputt));
	output = truncateString(outputt);
	document.getElementById("output").innerHTML = output[0];
	document.getElementById("copy-btn").innerHTML = `Copy (Part 1 of ${output.length})`;
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
	if (output.length === 0) return;
	navigator.clipboard.writeText(output[currentPart - 1]).then(function() {
	  console.log("Text copied to clipboard");
	}, function(err) {
	  console.error("Could not copy text: ", err);
	});
	currentPart++;
	if (currentPart > output.length) currentPart = 1;
	document.getElementById("copy-btn").innerHTML = `Copy (Part ${currentPart} of ${output.length})`;
	document.getElementById("output").innerHTML = output[currentPart - 1];
}
function truncateString(s) {
	const result = [];
	const regex = /#[(a-zA-Z)|/]+\,[^#]+#/g;
	const item = s.match(regex);
	let itemStr = "";
	for (const str of item) {
		if (itemStr.length + str.length <= 100) {
			itemStr += str;
		} else {
			result.push(itemStr);
			itemStr = "";
		}
	}
	if (itemStr.length > 0) result.push(itemStr);
	return result;
}