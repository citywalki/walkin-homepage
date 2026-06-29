import { browser } from "wxt/browser";

export default defineBackground({
	// Set manifest options
	persistent: true,
	type: "module",

	main() {
		// Executed when background is loaded, CANNOT BE ASYNC
		browser.bookmarks.onChanged.addListener((_id, changeInfo) => {
			console.info("changeInfo", changeInfo);
		});
		async function flatteBookmarksTree(_node) {
			return [{}];
		}

		async function _syncBookmarks() {
			const bookmarksTree = await browser.bookmarks.getTree();
			for (const node of bookmarksTree) {
				flatteBookmarksTree(node);
			}
		}
	},
});
