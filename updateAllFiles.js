const fs = require("fs");
const promisify = require("util").promisify;

const sanitizeLines = text => {
	let lines = text.replace(/\r/g, "").split("\n").slice(1, -1);
	let smallestIndent = Math.min(...lines
		.filter(line => line.replace(/\s/g, "").length > 0)
		.map(line => line.search(/[^\t]/)));
	return lines.map(line => line.replace(new RegExp("^\t{" + smallestIndent + "}"), "")).join("\n");
};

const indent = (level, lines) => lines.join("\n" + "\t".repeat(level));
const comment = text => ["/**", ...text.map(t => " * " + t), " */"];
const toArr = text => {
	if (typeof text == "string") {
		return [text];
	}
	return text;
};

(async () => {
	const contents = await promisify(fs.readdir)("metadata", "utf8");

	// Rudimentary templating system for generated files
	await Promise.all(contents.map(async name => {
		// Remove the .json extension
		name = name.slice(0, -5);
		const upperName = name.charAt(0).toUpperCase() + name.slice(1);
		
		const t = JSON.parse(await promisify(fs.readFile)(`metadata/${name}.json`, "utf8"));
		const example = await promisify(fs.readFile)(`examples/${name}.toml`, "utf8");
		await Promise.all([
			promisify(fs.writeFile)(`typings/${name}.d.ts`, sanitizeLines(`
				${indent(4, comment(toArr(t.desc)))}
				export default interface ${upperName} {
					${
						indent(5, t.properties.flatMap(prop => 
							[
								...comment(toArr(prop.desc)),
								`${prop.name}: ${prop.tsType || prop.type}`
							]
						))
					}
				}
			`)),
			promisify(fs.writeFile)(`schemas/${name}.json`, JSON.stringify({
				$schema: "http://json-schema.org/draft/2019-09/schema",
				description: t.shortDesc || t.desc,
				type: "object",
				properties: (() => {
					let props = {};
					t.properties.forEach(prop => {
						props[prop.name] = {
							description: prop.shortDesc || prop.desc,
							type: prop.type
						};
					});
					return props;
				})()
			}, null, "\t")),
			promisify(fs.writeFile)(`${name}.md`, sanitizeLines(`
				# ${upperName} file specification
				${indent(4, toArr(t.desc))}

				## Example
				\`\`\`toml
				${indent(4, example.split("\n"))}
				\`\`\`
				
				## Properties
				${
					// TODO: improve this later
					indent(4, t.properties.flatMap(prop => 
						[
							"### " + prop.name.charAt(0).toUpperCase() + prop.name.slice(1),
							...toArr(prop.desc),
							"",
							`**Type:** ${prop.type || prop.tsType}`,
							""
						]
					))
				}
			`))
		]);
	}));
})();