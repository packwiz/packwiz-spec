# packwiz-spec
A format for specifying Minecraft modpacks, designed to be easy to manipulate with tools. This modpack format is heavily inspired by the manifest format of [Scoop](https://github.com/lukesampson/scoop) and by [PackUpdate](https://github.com/XDjackieXD/PackUpdate). See the website generated from this specification at https://packwiz.infra.link/.

## Overview
The packwiz CLI uses a custom format to store metadata about files contained in modpacks, which allows automatic updating of files and distribution with packwiz-installer. This consists of 3 metadata file types using the [TOML format](https://toml.io/en/) as follows:

- `pack.toml` stores metadata about the modpack itself, including Minecraft and mod loader versions
- `index.toml` stores a list of files in the modpack, with hashes to determine when files have been changed
- `external.pw.toml` references files that are to be downloaded from an external support, with optional and side-only filtering, including metadata to allow these links to be updated
	- Any filename is allowed for these metadata files; `metafile = true` in the index indicates which files are external
	- The extension `.pw.toml` is recommended to allow `metafile = true` to be automatically set by the CLI (and may be required in a future version of the format)

`pack.toml` and `index.toml` are typically stored in the root directory of the modpack; external references can be placed in any directory, but they are typically used for mods and resource packs.

## JSON schemas
TOML files in the format are described by 3 JSON schemas. Two versions of the JSON schemas are available: strict and non-strict. Put simply, it is recommended you use the strict schemas for developing new modpacks, and the non-strict schemas for validating existing modpacks (e.g. in a third-party tool).

For development, these schemas are available from https://packwiz.infra.link/meta/format/v1/strict/, and can be used with the [Even Better TOML extension for VSCode](https://marketplace.visualstudio.com/items?itemName=tamasfe.even-better-toml) with the following settings.json configuration:

```json
"evenBetterToml.schema.associations": {
	"pack\\.toml": "https://packwiz.infra.link/meta/format/v1/strict/pack.json",
	"index\\.toml": "https://packwiz.infra.link/meta/format/v1/strict/index.json",
	".*\\.pw\\.toml": "https://packwiz.infra.link/meta/format/v1/strict/mod.json",
},
```

In a future pack format version (with the index removed, and `pack.toml` changed to `packwiz.toml` to prevent name clashes), these will likely be submitted to the JSON Schema Store so no manual configuration will be required.

The strict JSON schemas are intended to show all possible warnings and errors, to be used by those currently developing packs. As such, they enforce that the latest version of the pack format is used, and that no extraneous properties are added. Non-strict schemas specify the behaviour of tools interacting with the format programmatically, with lenience towards extraneous properties (though they may not be preserved in a round-trip deserialize/serialize) and older pack versions.

## Contributing
[Deno](https://deno.land/) is used to generate JSON schemas, with a custom DSL using TypeScript decorators. Run `deno task build` to re-generate schemas from the definitions in `src`.