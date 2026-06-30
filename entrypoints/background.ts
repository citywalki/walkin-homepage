import { browser } from "wxt/browser";
import { bookmarksStorage, flattenBookmarksTree } from "@/utils/bookmarks";

async function syncBookmarks() {
	try {
		const tree = await browser.bookmarks.getTree();
		const bookmarks = tree.flatMap((node) => flattenBookmarksTree(node));
		await bookmarksStorage.setValue(bookmarks);
		console.info(`[walkin] Synced ${bookmarks.length} bookmarks`);
	} catch (error) {
		console.error("[walkin] Failed to sync bookmarks:", error);
	}
}

export default defineBackground({
	// Set manifest options
	persistent: true,
	type: "module",

	main() {
		// Initial sync when background loads
		syncBookmarks();

		// Re-sync on any bookmark change
		browser.bookmarks.onChanged.addListener(() => syncBookmarks());
		browser.bookmarks.onCreated.addListener(() => syncBookmarks());
		browser.bookmarks.onRemoved.addListener(() => syncBookmarks());
		browser.bookmarks.onMoved.addListener(() => syncBookmarks());
	},
});
