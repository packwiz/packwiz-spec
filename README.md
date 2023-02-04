# packwiz-spec
A format for specifying Minecraft modpacks, designed to be easy to manipulate with tools. This modpack format is heavily inspired by the manifest format of [Scoop](https://github.com/lukesampson/scoop) and by [PackUpdate](https://github.com/XDjackieXD/PackUpdate). See the website generated from this specification at https://packwiz.infra.link/.

## Contributing
[Deno](https://deno.land/) is used to generate JSON schemas, with a custom DSL using TypeScript decorators. Run `deno task build` to re-generate schemas from the definitions in `src`.