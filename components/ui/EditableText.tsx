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

	const startEditing = () => setIsEditing(true);

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			save();
		} else if (e.key === "Escape") {
			e.preventDefault();
			cancel();
		}
	};

	const handleWrapperKeyDown = (e: KeyboardEvent) => {
		if (isEditing() || e.target !== e.currentTarget) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			startEditing();
		}
	};

	return (
		// biome-ignore lint/a11y/useSemanticElements: wrapper switches to an input while editing
		<span
			role="button"
			tabIndex={0}
			class="editable-text"
			on:click={(e) => {
				e.stopPropagation();
				startEditing();
			}}
			on:keydown={handleWrapperKeyDown}
		>
			<Show when={isEditing()} fallback={<span>{props.value}</span>}>
				<input
					type="text"
					value={draft()}
					placeholder={props.placeholder}
					ref={(el) => {
						el.focus();
						el.select();
					}}
					on:input={(e) => setDraft(e.currentTarget.value)}
					on:blur={save}
					on:keydown={handleKeyDown}
				/>
			</Show>
		</span>
	);
}
