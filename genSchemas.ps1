typescript-json-schema typings.d.ts Pack --strictNullChecks -o schemas/pack.json --required
typescript-json-schema typings.d.ts Index --strictNullChecks -o schemas/index.json --required

# typedoc --out test/ typings.d.ts --mode file --toc "Pack,Index" --includeDeclarations --excludeExternals