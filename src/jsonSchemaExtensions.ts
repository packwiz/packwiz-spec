// Declare x-taplo extension fields
declare module "npm:@types/json-schema" {
	export interface JSONSchema7 {
		"x-taplo"?: {
			hidden?: boolean;
			docs?: {
				main?: string;
				enumValues?: (string | null)[];
				defaultValue?: string;
			};
			links?: {
				key?: string;
				enumValues?: string[];
			};
			initKeys?: string[];
		};
		"x-packwiz-spec-gen"?: {
			exampleDoc?: string;
		};
	}
}
