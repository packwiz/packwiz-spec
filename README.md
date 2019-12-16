# packwiz-spec
A format for specifying Minecraft modpacks, designed to be easy to manipulate with tools.

## Where to Start
You probably want to start with the [[Pack]]. <!-- TODO: make it only do this for typedoc, not anything else -->The pack file defines properties of the modpack as a whole, and references the index file (if there are no changes in the index file it doesn't need to be downloaded).

The [[Index]] file references every file in the modpack. This file is typically generated using a tool like packwiz.

The [[Mod]] file defines a mod... !!

## Inspiration
This modpack format is heavily inspired by the manifest format of [Scoop](https://github.com/lukesampson/scoop) and by [PackUpdate](https://github.com/XDjackieXD/PackUpdate).

## Development
All the files are generated using `updateAllFiles.js` from the JSON files in the `metadata/` folders and the TOML files in the `examples/` folders.