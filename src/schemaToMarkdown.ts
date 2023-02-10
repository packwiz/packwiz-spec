/// <reference path="./jsonSchemaExtensions.ts"/>
/**
 * Generator of Markdown documentation for a subset of JSON schema
 * Usage: deno run --allow-env --allow-read=schemas ./src/schemaToMarkdown.ts [schema]
 * (outputs to stdout)
 * 
 * Generated markdown requires the following extensions:
 * - Definition lists (Python Markdown)
 * - Admonitions (Python Markdown)
 * - Details (PyMdown Extensions)
 * - SuperFences (PyMdown Extensions)
 */

import { JSONSchema7, JSONSchema7Type, JSONSchema7TypeName } from "npm:@types/json-schema";

// Custom CSS badges/indicators for property type and "required" tag
const enhancedDetailsTitles = true;

function printType(type: JSONSchema7Type): string {
	switch (typeof type) {
		case "string":
			return `\`${JSON.stringify(type)}\``;
		default:
			return `\`${type}\``;
	}
}

function getDetailsTitle(
	type: JSONSchema7TypeName | JSONSchema7TypeName[] | undefined,
	name: string,
	required: boolean,
	autoExpand = false,
) {
	if (type == undefined || Array.isArray(type)) {
		throw new Error(`Unsupported definition type for ${name} (array, or undefined)`);
	}

	if (enhancedDetailsTitles) {
		// It doesn't need to be escaped, somehow :)
		return `???${
			autoExpand ? "+" : ""
		} json-${type} "<div class="json-gen-enhanced-details"><div>${name}</div><div style="flex:1"></div>${
			required ? `<div class="json-gen-tag">Required</div>` : ""
		}<div class="json-gen-type">${type}</div></div>"`;
	} else {
		return `???${autoExpand ? "+" : ""} json-${type} "${name}${required ? " (required)" : ""}"`;
	}
}

class DocBuilder {
	private needsSpacing = false;
	public value = "";

	public appendParagraph(contents: string) {
		if (this.needsSpacing) {
			this.value += "\n\n";
			this.needsSpacing = false;
		}
		this.value += contents;
		this.needsSpacing = true;
	}
}

function genSchemaMarkdown(schema: JSONSchema7, depth: number): string {
	const doc = new DocBuilder();
	// Notably not implemented: format (described in description), title, $defs/$ref, pattern (not that useful, since it doesn't fully describe how validation should be implemented), conditional stuff
	if (schema.const != null) {
		doc.appendParagraph(`**Must equal** ${printType(schema.const)}`);
	}
	if (schema.enum != null) {
		doc.appendParagraph(`**One of:** ${schema.enum.map((ex) => printType(ex)).join(", ")}`);
	}
	if (schema.default != null) {
		doc.appendParagraph(`**Default:** ${printType(schema.default)}`);
	}
	if (schema.description != null) {
		doc.appendParagraph(schema.description);
	}
	if (schema["x-taplo"]?.docs?.enumValues != null && schema.enum != null) {
		const enumDoc = [];
		for (let i = 0; i < schema.enum.length; i++) {
			if (schema["x-taplo"].docs.enumValues[i] != null) {
				enumDoc.push(`\`${schema.enum[i]}\`

: ${schema["x-taplo"].docs.enumValues[i]?.replace(/\n/gm, "\n\t")}`);
			}
		}
		doc.appendParagraph(enumDoc.join("\n\n"));
	}
	if (schema.examples != null && Array.isArray(schema.examples) && schema.examples.length > 0) {
		const firstExample = schema.examples[0];
		if (typeof firstExample == "string" && firstExample.includes("\n")) {
			// Multiline examples
			doc.appendParagraph(`??? example "Example"`);
			if (schema["x-packwiz-spec-gen"]?.exampleDoc != null) {
				doc.appendParagraph("\t" + schema["x-packwiz-spec-gen"]?.exampleDoc.replace(/\n/gm, "\n\t"));
			}
			doc.appendParagraph(`\t\`\`\`toml
\t${firstExample.replace(/\n$/, "").replace(/\n/gm, "\n\t")}
\t\`\`\``);
		} else {
			// Single line examples
			doc.appendParagraph(
				`**Example${schema.examples.length > 1 ? "s" : ""}:** ${
					schema.examples.map((ex) => printType(ex)).join(", ")
				}`,
			);
		}
	}
	if (schema.uniqueItems) {
		doc.appendParagraph(`***Values must be unique***`);
	}
	if (schema.properties != null) {
		for (const key of Object.keys(schema.properties)) {
			const subSchema = schema.properties[key];
			if (typeof subSchema !== "boolean") {
				let propertyDoc = getDetailsTitle(
					subSchema.type,
					key,
					schema.required?.includes(key) ?? false,
					depth == 0 && (subSchema.type == "object" || subSchema.type == "array"),
				);
				propertyDoc += "\n\n\t";
				propertyDoc += genSchemaMarkdown(subSchema, depth + 1).replace(/\n/gm, "\n\t");
				doc.appendParagraph(propertyDoc);
			}
		}
	}
	if (schema.additionalProperties != null && typeof schema.additionalProperties !== "boolean") {
		let propertyDoc = getDetailsTitle(
			schema.additionalProperties.type,
			schema.additionalProperties.title ?? "Additional properties",
			false,
		);
		propertyDoc += "\n\n\t";
		propertyDoc += genSchemaMarkdown(schema.additionalProperties, depth + 1).replace(/\n/gm, "\n\t");
		doc.appendParagraph(propertyDoc);
	}
	if (schema.items != null && schema.items !== false && schema.items !== true) {
		const subSchemas = Array.isArray(schema.items) ? schema.items : [schema.items];
		for (const subSchema of subSchemas) {
			if (typeof subSchema !== "boolean") {
				let arrayItemDoc = getDetailsTitle(subSchema.type, "*Array item*", false, depth <= 1);
				arrayItemDoc += "\n\n\t";
				arrayItemDoc += genSchemaMarkdown(subSchema, depth + 1).replace(/\n/gm, "\n\t");
				doc.appendParagraph(arrayItemDoc);
			}
		}
	}

	return doc.value;
}

const rootSchema: JSONSchema7 = JSON.parse(await Deno.readTextFile(Deno.args[0]));
console.log(genSchemaMarkdown(rootSchema, 0));
