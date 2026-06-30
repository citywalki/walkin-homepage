import { storage } from "wxt/utils/storage";

export interface BookmarkItem {
	id: string;
	title: string;
	url: string;
}

export const bookmarksStorage = storage.defineItem<BookmarkItem[]>(
	"local:bookmarks",
	{
		fallback: [],
	},
);

export function flattenBookmarksTree(
	node: Browser.Bookmarks.BookmarkTreeNode,
): BookmarkItem[] {
	const results: BookmarkItem[] = [];
	if (node.url) {
		results.push({
			id: node.id,
			title: node.title || node.url,
			url: node.url,
		});
	}
	if (node.children) {
		for (const child of node.children) {
			results.push(...flattenBookmarksTree(child));
		}
	}
	return results;
}
