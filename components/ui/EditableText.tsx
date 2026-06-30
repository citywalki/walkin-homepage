import { createEffect, createSignal, Show } from "solid-js";

interface EditableTextProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

export function EditableText(props: EditableTextProps) {
	const [isEditing, setIsEditing] = createSignal(false);
	const [draft, setDraft] = createSignal(props.value);

	createEffect(() => {
		if (!isEditing()) {
			setDraft(props.value);
		}
	});

	const save = () => {
		props.onChange(draft().trim());
		setIsEditing(false);
	};

	const cancel = () => {
		setDraft(props.value);
		setIsEditing(false);
	};

	const insertPlainText = (text: string) => {
		const selection = window.getSelection();
		if (!selection || selection.rangeCount === 0) return;
		const range = selection.getRangeAt(0);
		range.deleteContents();
		range.insertNode(document.createTextNode(text));
		range.collapse(false);
		selection.removeAllRanges();
		selection.addRange(range);
	};

	const setCursorFromPoint = (x: number, y: number) => {
		const range =
			document.caretRangeFromPoint?.(x, y) ??
			(() => {
				const pos = document.caretPositionFromPoint?.(x, y);
				if (!pos) return null;
				const r = document.createRange();
				r.setStart(pos.offsetNode, pos.offset);
				r.collapse(true);
				return r;
			})();

		if (!range) return;

		const selection = window.getSelection();
		selection?.removeAllRanges();
		selection?.addRange(range);
	};

	const selectAll = (el: HTMLElement) => {
		const range = document.createRange();
		range.selectNodeContents(el);
		const selection = window.getSelection();
		selection?.removeAllRanges();
		selection?.addRange(range);
	};

	let lastClickX = 0;
	let lastClickY = 0;
	let selectAllOnFocus = false;

	const startEditing = (e: MouseEvent) => {
		lastClickX = e.clientX;
		lastClickY = e.clientY;
		selectAllOnFocus = e.type === "dblclick";
		setIsEditing(true);
	};

	const handleEditableRef = (el: HTMLSpanElement) => {
		el.textContent = draft();
		el.focus();

		if (selectAllOnFocus) {
			selectAll(el);
			return;
		}

		// Place cursor at the original click position; if the API is unavailable
		// or misses the element, the cursor stays at the end thanks to el.focus().
		if (lastClickX || lastClickY) {
			requestAnimationFrame(() => {
				setCursorFromPoint(lastClickX, lastClickY);
			});
		}
	};

	return (
		<span
			class="editable-text"
			on:click={(e) => {
				e.stopPropagation();
				if (!isEditing()) startEditing(e);
			}}
			on:dblclick={(e) => {
				e.stopPropagation();
				if (!isEditing()) {
					startEditing(e);
				} else {
					const target = e.currentTarget.querySelector("[contenteditable]");
					if (target instanceof HTMLElement) selectAll(target);
				}
			}}
		>
			<Show when={isEditing()} fallback={props.value}>
				<span
					contentEditable
					ref={handleEditableRef}
					on:input={(e) => setDraft(e.currentTarget.textContent ?? "")}
					on:blur={save}
					on:keydown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							save();
						} else if (e.key === "Escape") {
							e.preventDefault();
							cancel();
						}
					}}
					on:paste={(e) => {
						e.preventDefault();
						const text = e.clipboardData?.getData("text/plain") ?? "";
						insertPlainText(text.replace(/\n/g, " "));
					}}
				/>
			</Show>
		</span>
	);
}
