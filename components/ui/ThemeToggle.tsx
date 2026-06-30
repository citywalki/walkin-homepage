import type { JSX } from "solid-js";
import { createEffect, createSignal, For, onMount, Show } from "solid-js";
import {
	applyTheme,
	DEFAULT_THEME,
	type ThemeMode,
	themeStorage,
} from "@/utils/theme";

interface ThemeOption {
	value: ThemeMode;
	label: string;
	icon: (props: { class?: string }) => JSX.Element;
}

function SunIcon(props: { class?: string }) {
	return (
		<svg
			class={props.class}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<title>浅色</title>
			<circle cx="12" cy="12" r="4" />
			<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
		</svg>
	);
}

function MoonIcon(props: { class?: string }) {
	return (
		<svg
			class={props.class}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<title>深色</title>
			<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
		</svg>
	);
}

function AutoIcon(props: { class?: string }) {
	return (
		<svg
			class={props.class}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<title>自动</title>
			<rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
			<line x1="8" y1="21" x2="16" y2="21" />
			<line x1="12" y1="17" x2="12" y2="21" />
		</svg>
	);
}

const options: ThemeOption[] = [
	{ value: "light", label: "浅色", icon: SunIcon },
	{ value: "dark", label: "深色", icon: MoonIcon },
	{ value: "auto", label: "自动", icon: AutoIcon },
];

function renderIcon(mode: ThemeMode, className: string) {
	const option = options.find((o) => o.value === mode) ?? options[2];
	const Icon = option.icon;
	return <Icon class={className} />;
}

export function ThemeToggle() {
	const [mode, setMode] = createSignal<ThemeMode>(DEFAULT_THEME);
	const [open, setOpen] = createSignal(false);
	let containerRef: HTMLDivElement | undefined;

	onMount(() => {
		themeStorage.getValue().then((value) => {
			setMode(value ?? DEFAULT_THEME);
		});
	});

	const select = (value: ThemeMode) => {
		setMode(value);
		applyTheme(value);
		try {
			themeStorage.setValue(value).catch((error) => {
				console.error("[walkin] Failed to save theme:", error);
			});
		} catch (error) {
			console.error("[walkin] Failed to save theme:", error);
		}
		setOpen(false);
	};

	const handleClickOutside = (e: MouseEvent) => {
		if (containerRef && !containerRef.contains(e.target as Node)) {
			setOpen(false);
		}
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Escape") {
			setOpen(false);
		}
	};

	createEffect(() => {
		if (!open()) return;
		// Defer listener registration so the same click that opened the menu
		// doesn't immediately close it via handleClickOutside.
		const id = setTimeout(() => {
			document.addEventListener("click", handleClickOutside);
			document.addEventListener("keydown", handleKeyDown);
		}, 0);
		return () => {
			clearTimeout(id);
			document.removeEventListener("click", handleClickOutside);
			document.removeEventListener("keydown", handleKeyDown);
		};
	});

	return (
		<div
			class="theme-toggle"
			ref={(el) => {
				containerRef = el;
			}}
		>
			<button
				type="button"
				class="theme-toggle__trigger"
				aria-label="切换主题"
				aria-haspopup="listbox"
				aria-expanded={open()}
				on:click={(e) => {
					e.stopPropagation();
					setOpen(!open());
				}}
			>
				{renderIcon(mode(), "theme-toggle__icon")}
				<span class="theme-toggle__label">
					{(options.find((o) => o.value === mode()) ?? options[2]).label}
				</span>
			</button>
			<Show when={open()}>
				<div class="theme-toggle__menu" role="listbox" aria-label="主题选择">
					<For each={options}>
						{(option) => (
							<button
								type="button"
								role="option"
								aria-selected={mode() === option.value}
								class="theme-toggle__option"
								classList={{ "is-active": mode() === option.value }}
								on:click={() => select(option.value)}
							>
								<option.icon class="theme-toggle__icon" />
								<span class="theme-toggle__label">{option.label}</span>
							</button>
						)}
					</For>
				</div>
			</Show>
		</div>
	);
}
