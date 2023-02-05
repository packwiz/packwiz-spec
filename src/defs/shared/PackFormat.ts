import { SchemaGenerator } from "../../schemaDSL.ts";
import { JSONSchema7 } from "npm:@types/json-schema";
import { formatVersion, strictMode } from "../../constants.ts";

export class PackFormat implements SchemaGenerator {
	public readonly schema: JSONSchema7 = {
		type: "string",
		description:
			`A version string identifying the pack format and version of it. Currently, this pack format uses version ${formatVersion}.
If it is not defined, default to \"packwiz:1.0.0\" for backwards-compatibility with packs created before this field was added.

If it is defined:
- All consumers should fail to load the modpack if it does not begin with \"packwiz:\"
- All consumers should fail to load the modpack if the latter section is not valid semver as defined in https://semver.org/spec/v2.0.0.html
- All consumers should fail to load the modpack if the major version is greater than the version they support
- Consumers can suggest updating themselves if the minor version is greater than the version they implement
- Pack tools should suggest and support migration when they support a version newer than this field`,

		...strictMode
			? {
				const: `packwiz:${formatVersion}`,
			}
			: {
				default: `packwiz:1.0.0`,
				pattern:
					"^packwiz:(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$",
			},
	};
}
