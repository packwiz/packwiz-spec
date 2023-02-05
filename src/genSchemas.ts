import Pack from "./defs/Pack.ts";
import Index from "./defs/Index.ts";
import Mod from "./defs/Mod.ts";
import { strictMode } from "./constants.ts";

const packSchema = new Pack().schema;
const indexSchema = new Index().schema;
const modSchema = new Mod().schema;

const base = strictMode ? "schemas/strict/" : "schemas/";
await Deno.mkdir(base, { recursive: true });

await Deno.writeTextFile(
	base + "pack.json",
	JSON.stringify(packSchema, null, "\t"),
);
await Deno.writeTextFile(
	base + "index.json",
	JSON.stringify(indexSchema, null, "\t"),
);
await Deno.writeTextFile(
	base + "mod.json",
	JSON.stringify(modSchema, null, "\t"),
);
