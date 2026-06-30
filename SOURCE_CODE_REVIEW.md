# Source Code Review Instructions

This file is provided for the Firefox Add-ons review team to rebuild the extension from source.

## Build Environment

- Node.js 22
- pnpm 9+

## Build Steps

```bash
# Install dependencies
pnpm install --frozen-lockfile

# Type check
pnpm run compile

# Build and package the Firefox extension
pnpm zip:firefox
```

After running the above commands, the following files will be generated in `.output/`:

- `walkin-homepage-<version>-firefox.zip` — the packaged extension
- `walkin-homepage-<version>-sources.zip` — the corresponding source code archive

The contents of `walkin-homepage-<version>-firefox.zip` should match the submitted add-on package.

## Project Structure

- `entrypoints/` — WXT entrypoints (`background.ts`, `newtab/`)
- `components/` — SolidJS UI components
- `wxt.config.ts` — WXT configuration and manifest customization
- `tsconfig.json` — TypeScript configuration

## Notes

- No environment variables or secrets are required to build the extension.
- To include a stable extension ID in the Firefox manifest, set `FIREFOX_EXTENSION_ID` before running `pnpm zip:firefox`.
- The extension does not collect user data. See `wxt.config.ts` for the `data_collection_permissions` declaration.
- The `homepage` override in `chrome_settings_overrides` is Firefox-only and declared only for the Firefox build.
