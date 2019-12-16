/**
 * The main modpack file for a packwiz modpack.
 * This is the first file loaded, to allow the modpack downloader to download all the files in the modpack.
 * 
 * Example:
 * 
 * ```toml
 * name = "My Modpack"
 * 
 * [index]
 * file = "index.toml"
 * hash-format = "sha256"
 * hash = "e3d71dc5366997d84cab2d0b748a79bd8c3ad3433557a49dfac6cf2c7292d011"
 * 
 * [versions]
 * forge = "14.23.5.2838"
 * minecraft = "1.12.2"
 * ```
 * 
 */
// TODO: move to a .d.ts file?
interface Pack {
	/**
	 * The name of the modpack.
	 */
	name: string

	/**
	 * Information about the index file in this modpack.
	 */
	index: {
		// TODO: define properly
		file: string
		"hash-format": HashFormat
		// TODO: define with alias?
		hash: string
	}

	/**
	 * The versions of components used by this modpack - usually Minecraft and the mod loader this pack uses. The existence of a component implies that it should be installed.
	 */
	versions: {
		/**
		 * The version of Minecraft used by this modpack. This should be in the format used by the version.json files e.g. `1.12.2`, `16w02a` etc.
		 */
		minecraft: string
		/**
		 * The version of Forge used by this modpack, for example `14.23.5.2838`. This version must not include the Minecraft version as a prefix.
		 */
		forge?: string
		/**
		 * The version of the Fabric loader used by this modpack, for example `0.7.2+build.174`. The version of Yarn must also be specified for Fabric to be used.
		 */
		fabric?: string
		/**
		 * The version of the Yarn mappings used by this modpack, for example `1.15.1-pre1+build.1`.
		 */
		yarn?: string
		/**
		* This field theoretically supports other components - and you are free to implement them yourself - but adding documentation here would be preferable.
		*/
		[component: string]: string | undefined
	}
}

/**
 * A hashing format used to detect if a file has changed.
 */
type HashFormat = SHA256 | Murmur2

/**
 * The SHA-256 hashing standard. Used by default for metadata files.
 */
type SHA256 = "sha256"

/**
 * The MurmurHash2 32-bit hashing standard (seed 1) with some whitespace characters removed, stored as a positive integer.
 */
type Murmur2 = "murmur2"