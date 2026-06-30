import { pinyin } from "pinyin-pro";
import { storage } from "wxt/utils/storage";

export interface BookmarkItem {
	id: string;
	title: string;
	url: string;
	/** Full pinyin of the title (lowercase, no tones), e.g. "guge" for "谷歌". */
	pinyin?: string;
	/** First letters of each pinyin syllable, e.g. "gg" for "谷歌". */
	pinyinInitials?: string;
}

export const bookmarksStorage = storage.defineItem<BookmarkItem[]>(
	"local:bookmarks",
	{
		fallback: [],
	},
);

const CJK_RE = /[\u4e00-\u9fa5]/;

function extractPinyin(
	title: string,
): Pick<BookmarkItem, "pinyin" | "pinyinInitials"> {
	if (!CJK_RE.test(title)) {
		return { pinyin: undefined, pinyinInitials: undefined };
	}
	const syllables = pinyin(title, { toneType: "none", type: "array" });
	return {
		pinyin: syllables.join("").toLowerCase(),
		pinyinInitials: syllables
			.map((s) => s[0])
			.join("")
			.toLowerCase(),
	};
}

export function enrichBookmark(bookmark: BookmarkItem): BookmarkItem {
	if (bookmark.pinyin !== undefined && bookmark.pinyinInitials !== undefined) {
		return bookmark;
	}
	return {
		...bookmark,
		...extractPinyin(bookmark.title),
	};
}

export function flattenBookmarksTree(
	node: Browser.bookmarks.BookmarkTreeNode,
): BookmarkItem[] {
	const results: BookmarkItem[] = [];
	if (node.url) {
		results.push({
			id: node.id,
			title: node.title || node.url,
			url: node.url,
			...extractPinyin(node.title || node.url),
		});
	}
	if (node.children) {
		for (const child of node.children) {
			results.push(...flattenBookmarksTree(child));
		}
	}
	return results;
}
