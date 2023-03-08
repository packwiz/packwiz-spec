import Pack from "./defs/Pack.ts";
import Index from "./defs/Index.ts";
import Metafile from "./defs/Metafile.ts";
import { strictMode } from "./constants.ts";

const packSchema = new Pack().schema;
const indexSchema = new Index().schema;
const metaSchema = new Metafile().schema;

const base = strictMode ? "schemas/strict/" : "schemas/";
try {
	await Deno.removeSync(base, { recursive: true });
} catch (_) { /* Do nothing */ }
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
	base + "meta.json",
	JSON.stringify(metaSchema, null, "\t"),
);
