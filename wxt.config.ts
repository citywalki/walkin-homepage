import * as path from "node:path";
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
		}),
	}),
	vite: (_env) => {
		return {
			resolve: {
				alias: {
					"styled-system": path.resolve(__dirname, "styled-system"),
				},
			},
		};
	},
});
