# Platform Routing Build Scripts

## generate-manifest.ts

This script generates a lightweight manifest rendering function at build time by:

1. Reading the Handlebars template from the common render package
2. Converting it to a template literal function
3. Outputting a generated TypeScript file

This approach allows us to:
- Use the centralized template system for consistency
- Avoid including the heavy Handlebars runtime in our bundle
- Keep the Cloudflare Snippets size under 32KB

The script runs automatically when building serve_app.ts.

### Usage

The script is called automatically by the justfile when building serve_app:

```bash
just build serve_app
```

Or run it manually:

```bash
bun run scripts/generate-manifest.ts
```

This generates `src/renderManifest.generated.ts` which is imported by serve_app.ts.