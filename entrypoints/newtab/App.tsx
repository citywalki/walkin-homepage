import {
	createEffect,
	createSignal,
	For,
	onCleanup,
	onMount,
	Show,
} from "solid-js";
import { browser } from "wxt/browser";
import {
	type BookmarkItem,
	bookmarksStorage,
	enrichBookmark,
	flattenBookmarksTree,
} from "@/utils/bookmarks";

function App() {
	let searchInput: HTMLInputElement;

	const [search, setSearch] = createSignal("");
	const [slashMode, setSlashMode] = createSignal(false);
	const [selectedIndex, setSelectedIndex] = createSignal(0);
	const [bookmarks, setBookmarks] = createSignal<BookmarkItem[]>([]);
	const [loading, setLoading] = createSignal(true);

	const query = () => search().trim().toLowerCase();

	const filteredBookmarks = () => {
		const list = bookmarks() ?? [];
		const q = query();
		if (!q) return list;
		return list.filter((b: BookmarkItem) => {
			const title = b.title.toLowerCase();
			const url = b.url.toLowerCase();
			const pinyin = b.pinyin?.toLowerCase();
			const initials = b.pinyinInitials?.toLowerCase();
			return (
				title.includes(q) ||
				url.includes(q) ||
				pinyin?.includes(q) ||
				initials?.includes(q) ||
				false
			);
		});
	};

	createEffect(() => {
		query();
		setSelectedIndex(0);
	});

	const searchFocus = () => {
		searchInput?.focus();
	};

	const openBookmark = (url: string) => {
		location.href = url;
	};

	const handleInput = (e: InputEvent) => {
		const target = e.target as HTMLInputElement;
		const value = target.value;

		if (!slashMode() && value.startsWith("/")) {
			setSlashMode(true);
			setSearch(value.slice(1));
			return;
		}

		setSearch(value);
	};

	const searchKeydown = (e: KeyboardEvent) => {
		const target = e.target as HTMLInputElement;

		if (!slashMode() && e.key === "/") {
			e.preventDefault();
			setSlashMode(true);
			return;
		}

		if (slashMode()) {
			const items = filteredBookmarks();
			switch (e.key) {
				case "ArrowDown":
					e.preventDefault();
					setSelectedIndex((i) => Math.min(i + 1, items.length - 1));
					return;
				case "ArrowUp":
					e.preventDefault();
					setSelectedIndex((i) => Math.max(i - 1, 0));
					return;
				case "Enter": {
					e.preventDefault();
					const item = items[selectedIndex()];
					if (item) {
						openBookmark(item.url);
					}
					return;
				}
				case "Escape":
					e.preventDefault();
					setSlashMode(false);
					setSearch("");
					target.value = "";
					setSelectedIndex(0);
					return;
				case "Backspace":
					if (target.value === "") {
						e.preventDefault();
						setSlashMode(false);
						setSelectedIndex(0);
					}
					return;
			}
		}

		if (e.key === "Enter") {
			const s = search();
			if (!s) return;
			location.href = `https://www.bing.com/search?q=${encodeURIComponent(s)}`;
		}
	};

	onMount(() => {
		searchInput?.focus();

		async function loadBookmarks() {
			try {
				let value = await bookmarksStorage.getValue();
				if (!value?.length) {
					// Fallback: read directly if background hasn't synced yet
					const tree = await browser.bookmarks.getTree();
					value = tree.flatMap((node) => flattenBookmarksTree(node));
					await bookmarksStorage.setValue(value);
				} else {
					// Backfill pinyin for bookmarks synced before this feature
					value = value.map(enrichBookmark);
				}
				setBookmarks(value);
			} catch (error) {
				console.error("[walkin] Failed to load bookmarks:", error);
			} finally {
				setLoading(false);
			}
		}

		loadBookmarks();

		const unwatch = bookmarksStorage.watch((value) => {
			setBookmarks((value ?? []).map(enrichBookmark));
			setLoading(false);
		});
		onCleanup(() => unwatch());
	});

	return (
		<div on:click={searchFocus} class="home-page">
			<main>
				<div class="profile">
					<img
						class="profile__avatar"
						src="https://cdn.v2ex.com/gravatar/97227251c4a0e846063fd5f1d5201c92?size=64"
						alt=""
					/>
					<div class="profile__info">
						<p class="profile__title">Walkin</p>
						<p class="profile__signature">yolo.</p>
					</div>
				</div>
				<div class="search-box">
					<input
						on:input={handleInput}
						on:keydown={searchKeydown}
						ref={(el: HTMLInputElement) => {
							searchInput = el;
						}}
						class="search-box__input"
						type="text"
						placeholder={slashMode() ? "搜索书签…" : "使用Bing搜索"}
						id="searchInput"
						value={search()}
					/>
					<Show when={slashMode()}>
						<div role="listbox" class="bookmark-list" id="bookmarkList">
							<Show
								when={!loading()}
								fallback={<div class="bookmark-list__empty">加载中…</div>}
							>
								<For
									each={filteredBookmarks()}
									fallback={<div class="bookmark-list__empty">无匹配书签</div>}
								>
									{(bookmark, index) => (
										<div
											role="option"
											tabIndex={-1}
											aria-selected={index() === selectedIndex()}
											class="bookmark-item"
											onMouseEnter={() => setSelectedIndex(index())}
											on:click={() => openBookmark(bookmark.url)}
										>
											<p class="bookmark-item__title">{bookmark.title}</p>
											<p class="bookmark-item__url">{bookmark.url}</p>
										</div>
									)}
								</For>
							</Show>
						</div>
					</Show>
				</div>
			</main>
		</div>
	);
}

export default App;
