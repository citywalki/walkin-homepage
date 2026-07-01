import { createEffect, createSignal, Show } from "solid-js";

interface EditableTextProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

export function EditableText(props: EditableTextProps) {
	const [isEditing, setIsEditing] = createSignal(false);
	const [draft, setDraft] = createSignal(props.value);
	const [isComposing, setIsComposing] = createSignal(false);

	createEffect(() => {
		if (!isEditing()) {
			setDraft(props.value);
		}
	});

	let editableRef: HTMLSpanElement | undefined;
	let pendingSave = false;
	let pendingCancel = false;

	const syncDraftFromDom = () => {
		setDraft(editableRef?.textContent ?? "");
	};

	const save = () => {
		props.onChange((editableRef?.textContent ?? draft()).trim());
		setIsEditing(false);
		pendingSave = false;
		pendingCancel = false;
	};

	const cancel = () => {
		setDraft(props.value);
		setIsEditing(false);
		pendingSave = false;
		pendingCancel = false;
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
		editableRef = el;
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
			<Show
				when={isEditing()}
				fallback={
					<span
						class="editable-text__display"
						classList={{ "is-empty": !props.value }}
					>
						{props.value || props.placeholder || "\u00A0"}
					</span>
				}
			>
				<span
					contentEditable
					ref={handleEditableRef}
					on:input={syncDraftFromDom}
					on:compositionstart={() => setIsComposing(true)}
					on:compositionend={() => {
						setIsComposing(false);
						requestAnimationFrame(() => {
							syncDraftFromDom();
							if (pendingSave) save();
							if (pendingCancel) cancel();
						});
					}}
					on:blur={() => {
						if (isComposing()) {
							pendingSave = true;
							return;
						}
						save();
					}}
					on:keydown={(e) => {
						if (e.isComposing) return;
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
