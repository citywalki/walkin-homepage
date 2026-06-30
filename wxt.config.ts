import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
	modules: ["@wxt-dev/module-solid"],
	manifest: ({ browser }) => ({
		permissions: ["bookmarks", "storage", "webRequest"],
		...(browser === "firefox" && {
			// Firefox only: replace the browser's homepage with the extension page.
			// Chrome/Edge do not support homepage overrides.
			chrome_settings_overrides: {
				homepage: "newtab.html",
			},
			browser_specific_settings: {
				gecko: {
					// Optional: set this to a stable extension ID from AMO before publishing.
					// Example: "walkin-homepage@citywalki.com" or the AMO-assigned UUID.
					// Falls back to AMO auto-assigning an ID on first submission.
					...(process.env.FIREFOX_EXTENSION_ID && {
						id: process.env.FIREFOX_EXTENSION_ID,
					}),
					data_collection_permissions: {
						required: ["none"],
					},
				},
			},
		}),
	}),
});
