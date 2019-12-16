/**
 * A hashing format used to detect if a file has changed. You may use your own hash format, but the valid values here should be supported and expected for most packs, especially SHA-256 and Murmur2.
 */
type HashFormat = SHA256 | SHA512 | MD5 | Murmur2

/**
 * The SHA-256 hashing standard. Used by default for metadata files.
 */
type SHA256 = "sha256"

/**
 * The SHA-512 hashing standard.
 */
type SHA512 = "sha512"

/**
 * The MD5 hashing standard.
 */
type MD5 = "md5"

/**
 * The MurmurHash2 32-bit hashing standard (seed 1) with some characters removed before applying the hash (decimal bytes 9, 10, 13, 32), stored as a positive integer.
 * 
 * In Java, this is parsed as a long then casted to an int (so the sign bit is part of the value - Java doesn't have unsigned integers).
 */
type Murmur2 = "murmur2"

/**
 * TODO: document this
 */
type Path = string

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
interface Pack {
	/**
	 * The name of the modpack. This can be displayed in user interfaces to identify the pack, and it does not need to be unique between packs.
	 */
	name: string

	/**
	 * Information about the [[Index]] file in this modpack.
	 */
	index: {
		/**
		 * The path to the file that contains the index.
		 */
		file: Path
		/**
		 * The hash format (algorithm) for the hash of the index file.
		 */
		"hash-format": HashFormat
		/**
		 * The hash of the index file, as a string. Binary hashes should be stored as hexadecimal, and case should be ignored during parsing. Numeric hashes (e.g. Murmur2) should still be stored as a string, to ensure the value is preserved correctly.
		 */
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
 * The index file of the modpack, storing references to every file to be downloaded in the pack.
 * TODO: finish
 */
interface Index {
	/**
	 * The default hash format (algorithm) for every file in the index.
	 */
	"hash-format": HashFormat
	/**
	 * The files listed in this index.
	 */
	files: IndexFile[]
}

/**
 * A single file in the [[Index]], to be downloaded by the modpack installer.
 */
interface IndexFile {
	/**
	 * The path to the file to be downloaded.
	 */
	file: Path
	/**
	 * The hash of the specified file, as a string. Binary hashes should be stored as hexadecimal, and case should be ignored during parsing. Numeric hashes (e.g. Murmur2) should still be stored as a string, to ensure the value is preserved correctly.
	 */
	hash: string
	/**
	 * The hash format (algorithm) for the hash of the specified file.
	 */
	"hash-format": HashFormat
	
	alias?: string

	metafile?: boolean

	preserve?: boolean
}