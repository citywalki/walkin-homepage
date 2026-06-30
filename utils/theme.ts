import { storage } from "wxt/utils/storage";

export type ThemeMode = "light" | "dark" | "auto";

export const DEFAULT_THEME: ThemeMode = "auto";

export const themeStorage = storage.defineItem<ThemeMode>("local:theme", {
	fallback: DEFAULT_THEME,
	version: 1,
});

const MEDIA_QUERY = "(prefers-color-scheme: dark)";

export function resolveTheme(mode: ThemeMode): "light" | "dark" {
	if (mode === "auto") {
		return window.matchMedia(MEDIA_QUERY).matches ? "dark" : "light";
	}
	return mode;
}

export function applyTheme(mode: ThemeMode): void {
	const resolved = resolveTheme(mode);
	document.documentElement.setAttribute("data-theme", resolved);
	// Mirror to localStorage so the blocking script in index.html can read it synchronously
	try {
		localStorage.setItem("walkin-theme", mode);
	} catch {
		// Ignore localStorage errors (e.g. private mode).
	}
}

export function watchSystemTheme(
	callback: (resolved: "light" | "dark") => void,
): () => void {
	const media = window.matchMedia(MEDIA_QUERY);
	const handler = (event: MediaQueryListEvent) => {
		callback(event.matches ? "dark" : "light");
	};
	media.addEventListener("change", handler);
	return () => media.removeEventListener("change", handler);
}
