# v2 Draft Changes

- No more index
	- Why?
		- It causes many consistency issues; especially when used with Git (i.e. forgetting to refresh, CRLF conversion)
		- It causes churn in VCS systems; redundant information
		- It isn't necessary in protocols/formats that have their own method of listing files (i.e. Git, Zip, Local files)
	- Direct HTTP is no longer supported for installing packwiz packs
	- Git is now the primary method of installing packwiz packs; it comes with many benefits and is relatively simple to host with HTTP
		- 4 commands: `git init`, `git add .`, `git commit -m "Initial commit"`, `git update-server-info` gets you a folder that can be hosted as a Git repo
		- Has a built-in index, with efficient delta updates and packfiles
		- Allows for release/beta branches, tagged versions, updating to any version
		- Many free hosted Git platforms and open source self-hostable Git servers
		- Works over HTTP, SSH, FTP, and local files
- Required `.pw.toml` file extension for mod/file metadata (called "targets" in subsequent documentation)
	- Why?
		- Because the index is removed, there needs to be a way of distinguishing metadata files from other TOML files
		- `.toml` suffix used to ensure syntax highlighting in editors that don't explicitly support the format
	- Also allows targets to be placed in any folder without having to manually set `metafile = true`