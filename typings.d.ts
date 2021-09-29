// https://github.com/YousefED/typescript-json-schema#integer-type-alias
type integer = number;

/**
 * A hashing format used to detect if a file has changed. You may use your own hash format, but the valid values here should be supported and expected for most packs, especially SHA-256 and Murmur2.
 */
type HashFormat = SHA256 | SHA512 | MD5 | Murmur2;

/**
 * The SHA-256 hashing standard. Used by default for metadata files.
 */
type SHA256 = "sha256";

/**
 * The SHA-512 hashing standard.
 */
type SHA512 = "sha512";

/**
 * The MD5 hashing standard.
 */
type MD5 = "md5";

/**
 * The MurmurHash2 32-bit hashing standard (seed 1) with some characters removed before applying the hash (decimal bytes 9, 10, 13, 32), stored as a positive integer.
 *
 * In Java, this is parsed as a long then casted to an int (so the sign bit is part of the value - Java doesn't have unsigned integers).
 */
type Murmur2 = "murmur2";

/**
 * TODO: document this
 */
type Path = string;

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
 * hash = "e23c098c867dbb45f672cdb407392c7ed1eaa26d21b969ecf64a49d2a937fc0e"
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
  name: string;

  /**
   * Information about the [[Index]] file in this modpack.
   */
  index: {
    /**
     * The path to the file that contains the index.
     */
    file: Path;
    /**
     * The hash format (algorithm) for the hash of the index file.
     */
    "hash-format": HashFormat;
    /**
     * The hash of the index file, as a string. Binary hashes should be stored as hexadecimal, and case should be ignored during parsing. Numeric hashes (e.g. Murmur2) should still be stored as a string, to ensure the value is preserved correctly.
     */
    hash: string;
  };

  /**
   * The versions of components used by this modpack - usually Minecraft and the mod loader this pack uses. The existence of a component implies that it should be installed.
   */
  versions: {
    /**
     * The version of Minecraft used by this modpack. This should be in the format used by the version.json files e.g. `1.12.2`, `16w02a` etc. This value can be used by tools to determine which versions of mods should be installed.
     */
    minecraft: string;
    /**
     * The version of Forge used by this modpack, for example `14.23.5.2838`. This version must not include the Minecraft version as a prefix.
     */
    forge?: string;
    /**
     * The version of the Fabric loader used by this modpack, for example `0.7.2+build.174`. The version of Yarn must also be specified for Fabric to be used.
     */
    fabric?: string;
    /**
     * The version of the Yarn mappings used by this modpack, for example `1.15.1-pre1+build.1`.
     */
    yarn?: string;
    /**
     * This field theoretically supports other components - and you are free to implement them yourself - but adding documentation here would be preferable.
     */
    [component: string]: string | undefined;
  };
}

// TODO: fix [[files]] somehow?

/**
 * The index file of the modpack, storing references to every file to be downloaded in the pack.
 *
 * Example:
 *
 * ```toml
 * hash-format = "sha256"
 *
 * [[files]]
 * file = "mod.toml"
 * hash = "a82d23948043048cef6208c8cc8bdac1ea42b6f8d6d73074ea0ab9a955f7ddf2"
 * metafile = true
 * ```
 */
interface Index {
  /**
   * The default hash format (algorithm) for every file in the index.
   */
  "hash-format": HashFormat;
  /**
   * The files listed in this index.
   */
  files: IndexFile[];
}

/**
 * A single file in the [[Index]], to be downloaded by the modpack installer.
 * TODO: finish
 */
interface IndexFile {
  /**
   * The path to the file to be downloaded, relative to this index file.
   */
  file: Path;
  /**
   * The hash of the specified file, as a string. Binary hashes should be stored as hexadecimal, and case should be ignored during parsing. Numeric hashes (e.g. Murmur2) should still be stored as a string, to ensure the value is preserved correctly.
   */
  hash: string;
  /**
   * The hash format (algorithm) for the hash of the specified file. Defaults to the hash format specified in the index - ideally remove this value if it is equal to the hash format for the index to save space.
   */
  "hash-format"?: HashFormat;

  alias?: string;

  metafile?: boolean;

  preserve?: boolean;
}

/**
 * A physical Minecraft side. Server applies to the dedicated server, client applies to the client (and integrated server), and both applies to every installation.
 */
type Side = "client" | "server" | "both";

// TODO: make the type of URL dependant on the url type?

/**
 * A URI reference compliant to RFC 2396; specifically RFC 2396 amended by RFC 2732 for IPv6 support. This ensures compatibility with older URI parsers that do not support RFC 3986 - if your URI implementation complies with RFC 3986 make sure that it correctly encodes [ and ] to %5B and %5D respectively.
 */
type RFC2396URL = string;

// TODO: change semantics to not be specific to mods?

/**
 * A uhhh mod TODO
 *
 * Example:
 *
 * ```toml
 * name = "Demagnetize"
 * filename = "demagnetize-1.12.2-1.1.1.jar"
 * side = "both"
 *
 * [download]
 * url = "https://edge.forgecdn.net/files/2834/566/demagnetize-1.12.2-1.1.1.jar"
 * hash-format = "murmur2"
 * hash = "2953308073"
 *
 * [update]
 * [update.curseforge]
 * file-id = 2834566
 * project-id = 301356
 * release-channel = "beta"
 * ```
 */
interface Mod {
  /**
   * The name of the mod, which can be displayed in user interfaces to identify the mod. It does not need to be unique between mods, although this may cause confusion.
   */
  name: string;
  /**
   * The destination path of the mod file, relative to this file.
   */
  filename: Path;
  /**
   * The side on which this mod should be installed. Defaults to "both".
   */
  side?: Side;
  /**
   * Information about how to download this mod.
   */
  download: {
    /**
     * The URL to download the mod from.
     */
    url: RFC2396URL;
    /**
     * The hash of the specified file, as a string. Binary hashes should be stored as hexadecimal, and case should be ignored during parsing. Numeric hashes (e.g. Murmur2) should still be stored as a string, to ensure the value is preserved correctly.
     */
    hash: string;
    /**
     * The hash format (algorithm) for the hash of the specified file.
     */
    "hash-format": HashFormat;
  };

  /**
   * Information about the optional state of this mod. When excluded, this indicates that the mod is not optional.
   */
  option?: {
    /**
     * Whether or not the mod is optional. This can be set to false if you want to keep the description but make the mod required.
     */
    optional: boolean;
    /**
     * A description displayed to the user when they select optional mods. This should explain why or why not the user should enable the mod.
     */
    description: string;
    /**
     * If true, the mod will be enabled by default. If false, the mod will be disabled by default. If a pack format does not support optional mods but it does support disabling mods, the mod will be disabled if it defaults to being disabled.
     */
    default: boolean;
  };
  /**
   * Information about how to update the download details of this mod with tools. The information stored is specific to the update interface (see implementations of [[UpdateImplementation]]).
   *
   * If this value does not exist or there are no defined update values, the mod will not be automatically updated.
   *
   * If there are multiple defined update values, one of them will be chosen. The value that is chosen is not defined, so it is therefore dependant on the implementation of the tool (may not be deterministic, so do not rely on one value being chosen over another).
   */
  update?: {
    curseforge?: CurseforgeUpdate;
    /**
     * This field theoretically supports other update implementations - and you are free to implement them yourself - but adding documentation here would be preferable.
     */
    [name: string]: UpdateImplementation | undefined;
  };
}

/**
 * This interface defines no properties - it exists solely to restrict the possible update values to those that are intended as update implementations.
 */
interface UpdateImplementation {}

/**
 * An update value for updating mods downloaded from CurseForge.
 */
interface CurseforgeUpdate extends UpdateImplementation {
  /**
   * An integer representing the unique project ID of this mod. Updating will retrieve the latest file for this project ID that is valid (correct Minecraft version, release channel, modloader, etc.).
   */
  "project-id": integer;
  /**
   * An integer representing the unique file ID of this mod file. This can be used if more metadata needs to be obtained relating to the mod.
   */
  "file-id": integer;
  /**
   * The latest type of file that should be downloaded for the mod. Files will be downloaded if they have the same or greater stability than this setting - e.g. "beta" will download files that are marked as beta *and* those marked as release. The newest file that is valid will be retrieved. Alpha may not work correctly as alpha mods and files are not returned by the API.
   */
  "release-channel": "release" | "beta" | "alpha";
}
