# WXT + SolidJS

This template should help get you started developing with SolidJS in WXT.

## Release

Releases are automated via GitHub Actions.

### Required Secrets

Configure these in the repository's **Settings → Secrets and variables → Actions**:

| Secret | Description |
| --- | --- |
| `FIREFOX_EXTENSION_ID` | UUID from AMO "Technical Information" — used in `manifest.json` |
| `FIREFOX_JWT_ISSUER` | AMO API JWT issuer (API key) |
| `FIREFOX_JWT_SECRET` | AMO API JWT secret (API secret) |

> Note: The AMO URL slug (`walkin-homepage`) is public and hardcoded in the workflow for `wxt submit`.


### Publishing

1. In the GitHub repository, go to **Actions → Release → Run workflow**.
2. Enter the version you want to release (e.g., `0.1.0`).
3. Enable **Dry run** first to verify credentials without submitting.
4. Once the dry run passes, rerun the workflow with **Dry run** disabled.

The workflow will automatically:
- Update `package.json#version`
- Commit and push the version bump
- Create and push the `v{version}` tag
- Build and submit the extension to Firefox Add-ons
- Create a GitHub Release with the ZIPs attached

### Manual Tagging (Optional)

If you prefer to control the version locally, you can still update `package.json#version` manually, push the commit, and create a tag. However, the workflow is designed to be the single entry point for releases.
