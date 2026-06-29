import * as path from "node:path";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
	modules: ["@wxt-dev/module-solid"],
	manifest: {
		permissions: ["bookmarks", "storage", "webRequest"],
	},
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
