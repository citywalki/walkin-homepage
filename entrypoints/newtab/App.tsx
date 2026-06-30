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
	flattenBookmarksTree,
} from "@/utils/bookmarks";
import { css } from "../../styled-system/css";

function App() {
	let searchInput: HTMLInputElement;

	const [search, setSearch] = createSignal("");
	const [selectedIndex, setSelectedIndex] = createSignal(0);
	const [bookmarks, setBookmarks] = createSignal<BookmarkItem[]>([]);
	const [loading, setLoading] = createSignal(true);

	const query = () => search().slice(1).trim().toLowerCase();
	const isSlashMode = () => search().startsWith("/");

	const filteredBookmarks = () => {
		const list = bookmarks() ?? [];
		const q = query();
		if (!q) return list;
		return list.filter(
			(b: BookmarkItem) =>
				b.title.toLowerCase().includes(q) || b.url.toLowerCase().includes(q),
		);
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
		setSearch((e.target as HTMLInputElement).value);
	};

	const searchKeydown = (e: KeyboardEvent) => {
		const target = e.target as HTMLInputElement;

		if (isSlashMode()) {
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
					setSearch("");
					target.value = "";
					setSelectedIndex(0);
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
				}
				setBookmarks(value ?? []);
			} catch (error) {
				console.error("[walkin] Failed to load bookmarks:", error);
			} finally {
				setLoading(false);
			}
		}

		loadBookmarks();

		const unwatch = bookmarksStorage.watch((value) => {
			setBookmarks(value ?? []);
			setLoading(false);
		});
		onCleanup(() => unwatch());
	});

	return (
		<div
			on:click={searchFocus}
			class={css({
				height: "screen",
				width: "full",
				bgColor: "#f9f9fb",
				display: "flex",
				flexDirection: "row",
				justifyContent: "center",
			})}
		>
			<main
				class={css({
					display: "flex",
					flexDirection: "column",
					width: "720px",
					pt: "10rem",
					gap: 12,
				})}
			>
				<div
					class={css({
						display: "flex",
						height: "64px",
						spaceX: 3,
					})}
				>
					<img
						class={css({
							rounded: "xl",
							height: "64px",
							width: "64px",
							boxShadow: "2xl",
						})}
						src="https://cdn.v2ex.com/gravatar/97227251c4a0e846063fd5f1d5201c92?size=64"
						alt=""
					/>
					<div
						class={css({
							display: "flex",
							flexDirection: "column",
							justifyContent: "space-between",
						})}
					>
						<p
							class={css({
								fontSize: "3xl",
							})}
						>
							Walkin
						</p>
						<p
							class={css({
								fontSize: "sm",
							})}
						>
							yolo.
						</p>
					</div>
				</div>
				<div
					class={css({
						position: "relative",
					})}
				>
					<div class=" flex items-center bg-white rounded-lg border border-gray-200 shadow-md transition-shadow duration-200">
						<input
							on:input={handleInput}
							on:keydown={searchKeydown}
							ref={(el: HTMLInputElement) => {
								searchInput = el;
							}}
							class={css({
								flexGrow: 1,
								py: 3,
								px: 2,
								outline: "none",
								fontSize: "xl",
								fontWeight: "500",
							})}
							type="text"
							placeholder="使用Bing搜索，输入 / 访问书签"
							id="searchInput"
							value={search()}
						/>
					</div>
					<Show when={isSlashMode()}>
						<div
							role="listbox"
							class={css({
								position: "absolute",
								top: "full",
								left: 0,
								right: 0,
								mt: 2,
								bgColor: "white",
								borderRadius: "lg",
								borderWidth: "1px",
								borderColor: "gray.5",
								boxShadow: "lg",
								maxHeight: "320px",
								overflowY: "auto",
								zIndex: 10,
							})}
						>
							<Show
								when={!loading()}
								fallback={
									<div
										class={css({
											py: 3,
											px: 4,
											color: "gray.9",
										})}
									>
										加载中…
									</div>
								}
							>
								<For
									each={filteredBookmarks()}
									fallback={
										<div
											class={css({
												py: 3,
												px: 4,
												color: "gray.9",
											})}
										>
											无匹配书签
										</div>
									}
								>
									{(bookmark, index) => (
										<div
											role="option"
											tabIndex={-1}
											aria-selected={index() === selectedIndex()}
											class={css({
												py: 2,
												px: 4,
												cursor: "pointer",
												borderBottomWidth: "1px",
												borderColor: "gray.3",
												display: "flex",
												flexDirection: "column",
												gap: 1,
												bgColor: "transparent",
												"&:last-child": {
													borderBottomWidth: 0,
												},
												"&:hover": {
													bgColor: "gray.2",
												},
												"&[aria-selected='true']": {
													bgColor: "gray.3",
												},
											})}
											onMouseEnter={() => setSelectedIndex(index())}
											on:click={() => openBookmark(bookmark.url)}
										>
											<p
												class={css({
													fontSize: "md",
													fontWeight: "medium",
													truncate: true,
												})}
											>
												{bookmark.title}
											</p>
											<p
												class={css({
													fontSize: "xs",
													color: "gray.9",
													truncate: true,
												})}
											>
												{bookmark.url}
											</p>
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
