# WXT + SolidJS

This template should help get you started developing with SolidJS in WXT.

## Release

Releases are automated via GitHub Actions.

### Required Secrets

Configure these in the repository's **Settings → Secrets and variables → Actions**:

| Secret | Description |
| --- | --- |
| `FIREFOX_EXTENSION_ID` | Extension ID from [AMO](https://addons.mozilla.org/developers/) |
| `FIREFOX_JWT_ISSUER` | AMO API JWT issuer (API key) |
| `FIREFOX_JWT_SECRET` | AMO API JWT secret (API secret) |


### Publishing

1. Update `package.json#version` and commit.
2. Create and push a tag:
   ```bash
   git tag v0.1.0
   git push origin v0.1.0
   ```
3. The `Release` workflow will build, submit to Firefox Add-ons, and create a GitHub Release.

To test credentials without publishing, trigger the workflow manually (`workflow_dispatch`) with **Dry run** enabled.

See `.github/workflows/release.yml` and `SOURCE_CODE_REVIEW.md` for details.
